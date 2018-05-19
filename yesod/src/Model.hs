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

instance ToJSON (Entity User) where
    toJSON (Entity pid u) = object
        [ "id"      .= (String $ toPathPiece pid)
        , "name"   .= userName u
        , "email" .= userEmail u
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