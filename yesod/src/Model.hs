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