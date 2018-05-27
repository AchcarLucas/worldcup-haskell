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

-- User Logon
data DataLogin = DataLogin { email :: Text, password :: Text }

instance FromJSON DataLogin where
	parseJSON (Object u) = DataLogin 
		<$> u .: "email"
		<*> u .: "password"
	parseJSON _ = mzero

-- Update User

data DataPatchUser = DataPatchUser { p_login :: DataLogin, c_name :: String, c_password :: Text, c_gps_latitude :: Maybe Double, c_gps_longitude :: Maybe Double, c_telphone_1 :: Maybe String, c_telphone_2 :: String }

instance FromJSON DataPatchUser where
	parseJSON (Object u) = DataPatchUser 
		<$> u .: "login"
		<*> u .: "c_name"
		<*> u .: "c_password"
		<*> u .: "c_gps_latitude"
		<*> u .: "c_gps_longitude"
		<*> u .: "c_telphone_1"
		<*> u .: "c_telphone_2"
	parseJSON _ = mzero

-- Insert and Update Figure

data DataFigureUser = DataFigureUser { f_login :: DataLogin, figure_id :: Integer, amount :: Maybe Integer }

instance FromJSON DataFigureUser where
	parseJSON (Object u) = DataFigureUser 
		<$> u .: "login"
		<*> u .: "figure_id"
		<*> u .: "amount"
	parseJSON _ = mzero

{-*
	{
		"name": "Lucas Campos",
		"email": "achcarlucas@gmail.com",
		"password": "123",
		"gps_latitude": 1.000,
		"gps_longitude": -1.000,
		"telphone_1": "(13) 3471-4161",
		"telphone_2": "(13) 98114-4615"
	}
-}

-- Cria o usuário (Cadastro)
postCreateUserR :: Handler Value
postCreateUserR = do
	addHeader "Access-Control-Allow-Origin" "*"
	addHeader "Access-Control-Allow-Methods" "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS"
	client <- requireJsonBody :: Handler User
	cid <- runDB $ insert client
	sendStatusJSON created201 (object ["resp" .= cid])


{-*
	{
		"email" : "achcarlucas@gmail.com",
		"password" : "123"
	}
-}

-- Verifica se o usuário existe (Login)
postLoginUserR :: Handler Value
postLoginUserR = do
	addHeader "Access-Control-Allow-Origin" "*"
	addHeader "Access-Control-Allow-Methods" "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS"
	request <- requireJsonBody :: Handler DataLogin
	email <- return $ email request
	password <- return $ password request
	user <- runDB $ selectList [UserEmail ==. email, UserPassword ==. password] [Asc UserId]
	sendStatusJSON ok200 (object ["resp" .= user])


{-*
	{
		"login" : {
			"email" : "achcarlucas@gmail.com",
			"password" : "123"
		},
		"c_name" : "Teste",
		"c_password" : "123",
		"c_gps_latitude" : 0.0,
		"c_gps_longitude" : 0.0,
		"c_telphone_1" : "",
		"c_telphone_2" : ""
	}	
-}
-- Modifica o Usuário (Change)
patchChangeUserR :: Handler Value
patchChangeUserR = do
	addHeader "Access-Control-Allow-Origin" "*"
	request <- requireJsonBody :: Handler DataPatchUser
	email <- return $ email $ p_login request
	password <- return $ password $ p_login request

	-- Verifica se o usuário existe antes de fazer qualquer ação
	user <- runDB $ selectFirst [UserEmail ==. email, UserPassword ==. password] []
	when ((length user) == 0) $ sendStatusJSON status500 (object ["resp" .= Just (ResponseJSON { content = "", excpt = "invalid_user" })])

	-- Faz o update do usuário
	user_name <- return $ c_name request
	user_password <- return $ c_password request
	user_gps_latitude <- return $ c_gps_latitude request
	user_gps_longitude <- return $ c_gps_longitude request
	user_telphone_1 <- return $ c_telphone_1 request
	user_telphone_2 <- return $ c_telphone_2 request
	runDB $ updateWhere [UserEmail ==. email, UserPassword ==. password] [UserName =. user_name, UserPassword =. user_password, UserGps_latitude =. user_gps_latitude, UserGps_longitude =. user_gps_longitude, UserTelphone_1 =. user_telphone_1, UserTelphone_2 =. user_telphone_2]
	sendStatusJSON accepted202 (object ["resp" .= Just (ResponseJSON { content = "updated", excpt = "" })])

-- Permite o uso do PATCH, valida a requisição
optionsChangeUserR :: Handler RepPlain
optionsChangeUserR = do
    addHeader "Access-Control-Allow-Origin" "*"
    addHeader "Access-Control-Allow-Methods" "PATCH, OPTIONS"
    addHeader "Access-Control-Allow-Headers" "Origin, X-Requested-With, Content-Type, Accept"
    return $ RepPlain $ toContent ("" :: Text)

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
		}
		"figure_id" : 1,
		"amount" : 10 (Maybe)
	}	
-}

postEditFigureUserR :: Handler Value 
postEditFigureUserR = do
	addHeader "Access-Control-Allow-Origin" "*"
	request <- requireJsonBody :: Handler DataFigureUser
	sendStatusJSON accepted202 (object ["resp" .= Just (ResponseJSON { content = "tmp", excpt = "" })])