organization in ThisBuild := "edu.rpi.tw.twxplore"
scalaVersion in ThisBuild := "2.12.10"
version in ThisBuild := "1.0.0-SNAPSHOT"


// Constants
val playVersion = "2.8.0"


// Test settings
parallelExecution in ThisBuild := false


// Resolvers
resolvers in ThisBuild += Resolver.mavenLocal
resolvers in ThisBuild += Resolver.sonatypeRepo("snapshots")


// Projects
lazy val root = project
  .aggregate(geoApp, baseLib)
  .settings(
    skip in publish := true
  )

lazy val baseLib =
  (project in file("lib/scala/base")).settings(
    libraryDependencies ++= Seq(
      filters,
      guice,
      ws,
      "com.typesafe.play" %% "play" % playVersion,
      "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
      "edu.rpi.tw.twks" % "twks-client" % "1.0.4-SNAPSHOT",
      "org.apache.jena" % "jena-geosparql" % "3.13.1",
      "org.sangria-graphql" %% "sangria" % "1.4.2",
      "org.sangria-graphql" %% "sangria-slowlog" % "0.1.8",
      "org.sangria-graphql" %% "sangria-play-json" % "1.0.4",
      "org.scalatest" %% "scalatest" % "3.0.8" % Test,
      "org.slf4j" % "slf4j-simple" % "1.7.25" % Test
    ),
    name := "base-lib"
  )

lazy val geoApp = (project in file("app/geo"))
  .dependsOn(baseLib)
  .enablePlugins(PlayScala)
  .settings(
    libraryDependencies ++= Seq(
      organization.value %% "base-lib" % version.value,
      "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3" % Test
    ),
    name := "geo-app",
    routesGenerator := InjectedRoutesGenerator,
    // Adds additional packages into Twirl
    //TwirlKeys.templateImports += "com.example.controllers._"

    // Adds additional packages into conf/routes
    // play.sbt.routes.RoutesKeys.routesImport += "com.example.binders._"
    skip in publish := true
  )
