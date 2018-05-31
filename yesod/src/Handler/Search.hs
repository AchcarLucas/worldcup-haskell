{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Search where

import Database.Persist.Sql (rawSql)
import Database.Persist.Sql
import Data.Maybe
import Text.Read
import Import

-- This is a handler function for the GET request method on the HomeR
-- resource pattern. All of your resource patterns are defined in
-- config/routes
--
-- The majority of the code you will write in Yesod lives in these handler
-- functions. You can spread them across multiple files if you are so
-- inclined, or create a single monolithic file.

-- Recuperar Usuário por GPS
getSearchUserGpsR :: Int -> String -> String -> Handler Value
getSearchUserGpsR page s_lgt s_lng = do
	let resultsPerPage = 15
	lgt <- convertDouble s_lgt
	lng <- convertDouble s_lng
	clients <- selectUserByDistance resultsPerPage page lgt lng
	sendStatusJSON ok200 (object ["resp" .= clients])

-- Recupera as informações do usuário especifico
getSearchUserR :: UserId -> Handler Value
getSearchUserR cid = do
	client <- runDB $ selectFirst [UserId ==. cid] []
	when ((length client) == 0) $ sendStatusJSON status500 (object ["resp" .= Just (ResponseJSON { content = "", excpt = "invalid_user" })])
	sendStatusJSON ok200 (object ["resp" .= client])

-- Convert String para Double
convertDouble :: String -> Handler Double
convertDouble s = do
	return $ (read s)::Handler Double

-- Seleciona os usuários pela distância
selectUserByDistance :: Int -> Int -> Double -> Double -> Handler [Entity User]
selectUserByDistance limit page lgt lng = do 
	runDB $ rawSql "SELECT ?? FROM public.user ORDER BY (12742 * asin(sqrt(0.5 - cos ((gps_latitude - ?) * 0.017453292519943295) / 2 + cos (? * 0.017453292519943295) * cos(gps_latitude * 0.017453292519943295) * (1 - cos((gps_longitude - ?) * 0.017453292519943295)) / 2))) ASC LIMIT ? OFFSET ?" [toPersistValue lgt, toPersistValue lgt, toPersistValue lng, toPersistValue limit, toPersistValue $ limit*page]