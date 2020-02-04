import sbt.Keys.publish

organization in ThisBuild := "io.github.tetherless-world"
scalaVersion in ThisBuild := "2.12.10"
version in ThisBuild := "1.0.0-SNAPSHOT"


// Constants
val scenaVersion = "1.0.0-SNAPSHOT"
val playVersion = "2.8.0"


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
useGpg in ThisBuild := false


// Test settings
parallelExecution in ThisBuild := false


// Resolvers
resolvers in ThisBuild += Resolver.mavenLocal
resolvers in ThisBuild += Resolver.sonatypeRepo("snapshots")


// Projects
lazy val root = project
  .aggregate(geoApp, baseLib, geoLib, treeCli, treeLib)
  .settings(
    publish / skip := true
  )

lazy val baseLib =
  (project in file("lib/scala/base"))
    .dependsOn(testLib % "test->compile")
    .settings(
      libraryDependencies ++= Seq(
        filters,
        guice,
        ws,
        "com.typesafe.play" %% "play" % playVersion,
        "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
        "edu.rpi.tw.twks" % "twks-client" % "1.0.4-SNAPSHOT",
        organization.value %% "scena" % scenaVersion,
        "org.apache.jena" % "jena-geosparql" % "3.13.1",
        "org.sangria-graphql" %% "sangria" % "1.4.2",
        "org.sangria-graphql" %% "sangria-slowlog" % "0.1.8",
        "org.sangria-graphql" %% "sangria-play-json" % "1.0.4"
      ),
      name := "twxplore-base-lib"
    )

lazy val geoApp = (project in file("app/geo"))
  .dependsOn(geoLib % "compile->compile;test->test")
  .enablePlugins(PlayScala)
  .settings(
    libraryDependencies ++= Seq(
      "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3" % Test
    ),
    name := "geo-app",
    routesGenerator := InjectedRoutesGenerator,
    // Adds additional packages into Twirl
    //TwirlKeys.templateImports += "com.example.controllers._"

    // Adds additional packages into conf/routes
    // play.sbt.routes.RoutesKeys.routesImport += "com.example.binders._"
    publish / skip := true
  )

lazy val geoLib =
  (project in file("lib/scala/geo"))
    .dependsOn(baseLib, testLib % "test->compile")
    .settings(
      name := "twxplore-geo-lib",
      publish / skip := true
    )

lazy val treeCli = (project in file("cli/tree"))
  .dependsOn(treeLib)
  .enablePlugins(AssemblyPlugin)
  .settings(
    assemblyMergeStrategy in assembly := {
      case "logback.xml" => MergeStrategy.first
      case x =>
        val oldStrategy = (assemblyMergeStrategy in assembly).value
        oldStrategy(x)
    },
    assemblyOutputPath in assembly := baseDirectory.value / "dist" / ("tree-cli.jar"),
    mainClass in assembly := Some("io.github.tetherlessworld.twxplore.cli.tree.TreeCli"),
    libraryDependencies ++= Seq(
      "com.beust" % "jcommander" % "1.78"
    ),
    name := "tree-cli",
    publish / skip := true
  )

lazy val testLib =
  (project in file("lib/scala/test"))
    .settings(
      libraryDependencies ++= Seq(
        organization.value %% "scena" % scenaVersion,
        "org.scalatest" %% "scalatest" % "3.0.8",
        "org.slf4j" % "slf4j-simple" % "1.7.25",
      ),
      name := "twxplore-test-lib"
    )

lazy val treeLib =
  (project in file("lib/scala/tree"))
    .dependsOn(geoLib)
    .settings(
      name := "twxplore-tree-lib",
      publish / skip := true
    )
