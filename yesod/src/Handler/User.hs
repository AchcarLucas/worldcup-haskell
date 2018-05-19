{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.User where

import Import

-- This is a handler function for the GET request method on the HomeR
-- resource pattern. All of your resource patterns are defined in
-- config/routes
--
-- The majority of the code you will write in Yesod lives in these handler
-- functions. You can spread them across multiple files if you are so
-- inclined, or create a single monolithic file.

data Login = Login { email :: Text, password :: Text }

instance FromJSON Login where
	parseJSON (Object u) = Login 
		<$> u .: "email"
		<*> u .: "password"
	parseJSON _ = mzero

data PatchUser = PatchUser { login :: Login, c_name :: String, c_password :: Text, c_gps_latitude :: Double, c_gps_longitude :: Double, c_telphone_1 :: Text, c_telphone_2 :: Text }

instance FromJSON PatchUser where
	parseJSON (Object u) = PatchUser 
		<$> u .: "login"
		<*> u .: "c_name"
		<*> u .: "c_password"
		<*> u .: "c_gps_latitude"
		<*> u .: "c_gps_longitude"
		<*> u .: "telphone_1"
		<*> u .: "telphone_2"
	parseJSON _ = mzero

-- Cria o usuário (Cadastro)
postCreateUserR :: Handler Value
postCreateUserR = do
	client <- requireJsonBody :: Handler User
	cid <- runDB $ insert client
	sendStatusJSON ok200 (object ["resp" .= cid])

-- Verifica se o usuário existe (Login)
postLoginUserR :: Handler Value
postLoginUserR = do
	request <- requireJsonBody :: Handler Login
	email <- return $ email request
	password <- return $ password request
	user <- runDB $ selectList [UserEmail ==. email, UserPassword ==. password] [Asc UserId]
	sendStatusJSON ok200 (object ["resp" .= user])