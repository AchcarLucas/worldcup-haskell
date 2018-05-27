{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Figure where

import Import

-- This is a handler function for the GET request method on the HomeR
-- resource pattern. All of your resource patterns are defined in
-- config/routes
--
-- The majority of the code you will write in Yesod lives in these handler
-- functions. You can spread them across multiple files if you are so
-- inclined, or create a single monolithic file.

insertFigure :: Integer -> Handler Value
insertFigure 0 = do
	all_figure <- runDB $ selectList [] [Asc FigureId]
	sendStatusJSON ok200 (object ["resp" .= all_figure])

insertFigure n = do
	time <- liftIO getCurrentTime
	runDB $ insert  $ Figure "" 1 time time
	insertFigure $ n - 1

getAllFigureR :: Handler Value
getAllFigureR = do
	addHeader "Access-Control-Allow-Origin" "*"
	all_figure <- runDB $ selectList [] [Asc FigureId]
	if ((length all_figure) == 0) then insertFigure 682
	else sendStatusJSON ok200 (object ["resp" .= all_figure])