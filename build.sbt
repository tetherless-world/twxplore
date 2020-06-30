import sbt.Keys.publish

organization in ThisBuild := "io.github.tetherless-world"
scalaVersion in ThisBuild := "2.12.10"
version in ThisBuild := "1.0.0-SNAPSHOT"


// Constants
val playVersion = "2.8.0"
val jenaVersion = "3.14.0"
val scenaVersion = "1.0.1-SNAPSHOT"
val slf4jVersion = "1.7.25"
val twksVersion = "1.0.5-SNAPSHOT"


// Publish settings
// Adapted from https://leonard.io/blog/2017/01/an-in-depth-guide-to-deploying-to-maven-central/ and
// https://www.scala-sbt.org/1.x/docs/Using-Sonatype.html
developers in ThisBuild := List(
  Developer("gordom6",
    "Minor Gordon",
    "gordom6@rpi.edu",
    url("https://github.com/gordom6")),
  Developer("KristoferKwan",
    "Kristofer Kwan",
    "kwank@rpi.edu",
    url("https://github.com/KristoferKwan"))
)
homepage in ThisBuild := Some(url("https://github.com/tetherless-world/twxplore"))
licenses in ThisBuild += ("Apache-2.0", url("http://www.apache.org/licenses/LICENSE-2.0"))
publishMavenStyle in ThisBuild := true
publishTo in ThisBuild := Some(
  if (isSnapshot.value)
    Opts.resolver.sonatypeSnapshots
  else
    Opts.resolver.sonatypeStaging
)
scmInfo in ThisBuild := Some(ScmInfo(url("https://github.com/tetherless-world/twxplore"), "git@github.com:tetherless-world/twxplore.git"))
skip in publish := true // Don't publish the default project ('twxplore')
//useGpg in ThisBuild := false


// Test settings
parallelExecution in ThisBuild := false


// Resolvers
//resolvers in ThisBuild += Resolver.mavenLocal
resolvers in ThisBuild += Resolver.sonatypeRepo("snapshots")

// Projects
lazy val root = project
  .aggregate(baseLib, geoLib)
  .settings(
    skip in publish := true
  )

lazy val baseLib =
  (project in file("lib/scala/base"))
    .settings(
      libraryDependencies ++= Seq(
        filters,
        guice,
        ws,
        "com.typesafe.play" %% "play" % playVersion,
        "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
        "edu.rpi.tw.twks" % "twks-direct-client" % twksVersion % Test,
        "edu.rpi.tw.twks" % "twks-mem" % twksVersion % Test,
        "edu.rpi.tw.twks" % "twks-rest-client" % twksVersion,
        organization.value %% "scena" % scenaVersion,
        "io.circe" %% "circe-generic" % "0.12.3",
        "nl.grons" %% "metrics4-scala" % "4.1.1",
        "org.apache.jena" % "jena-geosparql" % jenaVersion,
        "org.sangria-graphql" %% "sangria" % "1.4.2",
        "org.sangria-graphql" %% "sangria-circe" % "1.2.1",
        "org.sangria-graphql" %% "sangria-slowlog" % "0.1.8",
        "org.sangria-graphql" %% "sangria-play-json" % "1.0.4",
        // "org.scalatest" %% "scalatest" % "3.0.8",
        "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3" % Test,
        "org.slf4j" % "slf4j-simple" % slf4jVersion % Test,
      ),
      name := "twxplore-base"
    )

lazy val geoLib =
  (project in file("lib/scala/geo"))
    .dependsOn(baseLib % "compile->compile;test->test")
    .settings(
      libraryDependencies ++= Seq(
        // For the WKT parser
        "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4"
      ),
      name := "twxplore-geo-lib"
    )
