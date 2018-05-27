{-# LANGUAGE EmptyDataDecls             #-}
{-# LANGUAGE FlexibleInstances          #-}
{-# LANGUAGE GADTs                      #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE MultiParamTypeClasses      #-}
{-# LANGUAGE NoImplicitPrelude          #-}
{-# LANGUAGE OverloadedStrings          #-}
{-# LANGUAGE TemplateHaskell            #-}
{-# LANGUAGE TypeFamilies               #-}
module Model where

import ClassyPrelude.Yesod
import Database.Persist.Quasi

-- You can define all of your database entities in the entities file.
-- You can find more information on persistent and how to declare entities
-- at:
-- http://www.yesodweb.com/book/persistent/
share [mkPersist sqlSettings, mkMigrate "migrateAll"]
    $(persistFileWith lowerCaseSettings "config/models")

--------------------------------------------------------------------------

instance ToJSON (Entity User) where
    toJSON (Entity pid u) = object
        [ "id"      .= (String $ toPathPiece pid)
        , "name"   .= userName u
        , "email" .= userEmail u
        , "gps_latitude" .= userGps_latitude u
        , "gps_longitude" .= userGps_longitude u
        , "telphone_1" .= userTelphone_1 u
        , "telphone_2" .= userTelphone_2 u
        ]

instance FromJSON User where
	parseJSON (Object u) = User 
		<$> u .: "name"
		<*> u .: "email"
		<*> u .: "password"
		<*> u .: "gps_latitude"
		<*> u .: "gps_longitude"
		<*> u .: "telphone_1"
		<*> u .: "telphone_2"
	parseJSON _ = mzero

--------------------------------------------------------------------------

data ResponseJSON = ResponseJSON { content :: String, excpt :: String }

instance FromJSON ResponseJSON where
	parseJSON (Object u) = ResponseJSON 
		<$> u .: "content"
		<*> u .: "excpt"
	parseJSON _ = mzero

instance ToJSON ResponseJSON where
    toJSON (ResponseJSON content excpt) = object
        [ 
        	"excpt" .= excpt
        	,"content" .= content
        ]

--------------------------------------------------------------------------

instance ToJSON (Entity FigureUser) where
    toJSON (Entity pid u) = object
        [ "figure_id"   .= figureUserFigure_id u
        , "amount" .= figureUserAmount u
        ]

instance FromJSON FigureUser where
    parseJSON (Object u) = FigureUser 
        <$> u .: "user_id"
        <*> u .: "figure_id"
        <*> u .: "amount"
        <*> u .: "dt_created"
        <*> u .: "dt_update"
    parseJSON _ = mzero

--------------------------------------------------------------------------

instance ToJSON (Entity TradeFigure) where
    toJSON (Entity pid u) = object
        [ "figure_id"   .= tradeFigureFigure_id u
        , "amount" .= tradeFigureAmount u
        ]

instance FromJSON TradeFigure where
    parseJSON (Object u) = TradeFigure 
        <$> u .: "user_id"
        <*> u .: "figure_id"
        <*> u .: "amount"
        <*> u .: "dt_created"
        <*> u .: "dt_update"
    parseJSON _ = mzero

--------------------------------------------------------------------------

instance ToJSON (Entity Figure) where
    toJSON (Entity pid u) = object
        [ "figure_id" .= (String $ toPathPiece pid)
        , "name"   .= figureName u
        , "valuable" .= figureValuable u
        ]

instance FromJSON Figure where
    parseJSON (Object u) = Figure 
        <$> u .: "name"
        <*> u .: "valuable"
        <*> u .: "dt_created"
        <*> u .: "dt_update"
    parseJSON _ = mzero

--------------------------------------------------------------------------

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

data DataFigure = DataFigure { f_login :: DataLogin, figure_id :: FigureId, amount :: Int }

instance FromJSON DataFigure where
    parseJSON (Object u) = DataFigure 
        <$> u .: "login"
        <*> u .: "figure_id"
        <*> u .: "amount"
    parseJSON _ = mzero