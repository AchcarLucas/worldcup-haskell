{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.FigureUser where

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

-- Recupera as figuras de um determinado usuário
-- /user/figure/#UserID/recovery

getRecoveryFigureUserR :: UserId -> Handler Value
getRecoveryFigureUserR uid = do
	addHeader "Access-Control-Allow-Origin" "*"
	figures <- runDB $ selectList [FigureUserUser_id ==. uid] [Asc FigureUserFigure_id]
	sendStatusJSON ok200 (object ["resp" .= figures])

{-*
	{
		"login" : {
			"email" : "achcarlucas@gmail.com",
			"password" : "123"
		},
		"figura_id" : 1
		"amount" : 10 (Maybe)
	}	
-}

-- Altera ou Insere uma figurinha no usuário
postEditFigureUserR :: Handler Value 
postEditFigureUserR = do
	addHeader "Access-Control-Allow-Origin" "*"
	request <- requireJsonBody :: Handler DataFigureUser
	email <- return $ email $ f_login request
	password <- return $ password $ f_login request

	-- Verifica se o usuário existe antes de fazer qualquer ação
	user <- runDB $ selectFirst [UserEmail ==. email, UserPassword ==. password] []
	when ((length user) == 0) $ sendStatusJSON status500 (object ["resp" .= Just (ResponseJSON { content = "", excpt = "invalid_user" })])

	fid <- return $ figure_id $ request
	amount <- return $ amount $ request

	check_figure <- checkFigureUser user fid
	if (check_figure) then
		updateFigure user fid amount
	else
		insertFigure user fid amount

-- Verifica se o usuário possui a figurinha no banco
checkFigureUser :: Maybe (Entity User) -> FigureId -> Handler Bool
checkFigureUser (Just (Entity uid _ )) fid = do
	figure <- runDB $ selectFirst [FigureUserUser_id ==. uid, FigureUserFigure_id ==. fid] []
	if ((length figure) == 0) then return (False)
	else return (True)
checkFigureUser Nothing _ = return (False)

-- Faz o update de uma figura que já existe no usuário
updateFigure :: Maybe (Entity User) -> FigureId -> Int -> Handler Value
updateFigure (Just (Entity uid _ )) fid amount = do
	runDB $ updateWhere [FigureUserUser_id ==. uid, FigureUserFigure_id ==. fid] [FigureUserAmount =. amount]
	sendStatusJSON accepted202 (object ["resp" .= Just (ResponseJSON { content = "updated", excpt = "" })])

-- Insere uma figura no usuário
insertFigure :: Maybe (Entity User) -> FigureId  -> Int -> Handler Value
insertFigure (Just (Entity uid _ )) fid amount = do
	time <- liftIO getCurrentTime
	fid <- runDB $ insert $ FigureUser uid fid amount time time
	sendStatusJSON accepted202 (object ["resp" .= Just (ResponseJSON { content = "inserted", excpt = "" })])
