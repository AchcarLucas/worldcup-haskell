{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.FigureTrade where

import Database.Persist.Sql
import Data.Maybe
import Data.Bool
import Import

-- This is a handler function for the GET request method on the HomeR
-- resource pattern. All of your resource patterns are defined in
-- config/routes
--
-- The majority of the code you will write in Yesod lives in these handler
-- functions. You can spread them across multiple files if you are so
-- inclined, or create a single monolithic file.

-- Recupera as figuras de troca de um determinado usuário
-- /user/figure/#UserID/recovery

getRecoveryFigureTradeR :: UserId -> Handler Value
getRecoveryFigureTradeR uid = do
	addHeader "Access-Control-Allow-Origin" "*"
	figures <- runDB $ selectList [TradeFigureUser_id ==. uid] [Asc TradeFigureFigure_id]
	sendStatusJSON ok200 (object ["resp" .= figures])

{-*
	{
		"login" : {
			"email" : "achcarlucas@gmail.com",
			"password" : "123"
		},
		"figura_id" : 1
		"amount" : 10
	}	
-}

-- Altera ou Insere uma figurinha de troca no usuário
postEditFigureTradeR :: Handler Value 
postEditFigureTradeR = do
	addHeader "Access-Control-Allow-Origin" "*"
	request <- requireJsonBody :: Handler DataFigure
	email <- return $ email $ f_login request
	password <- return $ password $ f_login request

	-- Verifica se o usuário existe antes de fazer qualquer ação
	user <- runDB $ selectFirst [UserEmail ==. email, UserPassword ==. password] []
	when ((length user) == 0) $ sendStatusJSON status500 (object ["resp" .= Just (ResponseJSON { content = "", excpt = "invalid_user" })])

	fid <- return $ figure_id $ request
	amount <- return $ amount $ request

	check_figure <- checkFigureTrade user fid
	if (check_figure) then
		updateFigureTrade user fid amount
	else
		insertFigureTrade user fid amount

-- Verifica se o usuário possui a figurinha de troca no banco
checkFigureTrade :: Maybe (Entity User) -> FigureId -> Handler Bool
checkFigureTrade (Just (Entity uid _ )) fid = do
	figure <- runDB $ selectFirst [TradeFigureUser_id ==. uid, TradeFigureFigure_id ==. fid] []
	if ((length figure) == 0) then return (False)
	else return (True)
checkFigureUser Nothing _ = return (False)

-- Faz o update de uma figura de troca que já existe no usuário
updateFigureTrade :: Maybe (Entity User) -> FigureId -> Int -> Handler Value
updateFigureTrade (Just (Entity uid _ )) fid amount = do
	runDB $ updateWhere [TradeFigureUser_id ==. uid, TradeFigureFigure_id ==. fid] [TradeFigureAmount =. amount]
	sendStatusJSON accepted202 (object ["resp" .= Just (ResponseJSON { content = "updated", excpt = "" })])

-- Insere uma figura de troca no usuário
insertFigureTrade :: Maybe (Entity User) -> FigureId  -> Int -> Handler Value
insertFigureTrade (Just (Entity uid _ )) fid amount = do
	time <- liftIO getCurrentTime
	fid <- runDB $ insert $ TradeFigure uid fid amount time time
	sendStatusJSON accepted202 (object ["resp" .= Just (ResponseJSON { content = "inserted", excpt = "" })])
