import sbt.Keys.publish

organization in ThisBuild := "io.github.tetherless-world"
scalaVersion in ThisBuild := "2.12.10"
version in ThisBuild := "1.0.0-SNAPSHOT"


// Constants
val scenaVersion = "1.0.1-SNAPSHOT"
val playVersion = "2.8.0"
val slf4jVersion = "1.7.25"
val twksVersion = "1.0.4-SNAPSHOT"


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
  .aggregate(geoApp, baseLib, geoLib, treeCli, treeLib)
  .disablePlugins(AssemblyPlugin)
  .settings(
    skip in publish := true
  )

lazy val baseLib =
  (project in file("lib/scala/base"))
    .disablePlugins(AssemblyPlugin)
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
        "nl.grons" %% "metrics4-scala" % "4.1.1",
        "org.apache.jena" % "jena-geosparql" % "3.13.1",
        "org.sangria-graphql" %% "sangria" % "1.4.2",
        "org.sangria-graphql" %% "sangria-slowlog" % "0.1.8",
        "org.sangria-graphql" %% "sangria-play-json" % "1.0.4",
        // "org.scalatest" %% "scalatest" % "3.0.8",
        "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3" % Test,
        "org.slf4j" % "slf4j-simple" % slf4jVersion % Test,
      ),
      name := "twxplore-base-lib"
    )

lazy val geoApp = (project in file("app/geo"))
  .dependsOn(geoLib % "compile->compile;test->test")
  .disablePlugins(AssemblyPlugin)
  .enablePlugins(PlayScala)
  .settings(
    name := "geo-app",
    routesGenerator := InjectedRoutesGenerator,
    // Adds additional packages into Twirl
    //TwirlKeys.templateImports += "com.example.controllers._"

    // Adds additional packages into conf/routes
    // play.sbt.routes.RoutesKeys.routesImport += "com.example.binders._"
    skip in publish := true
  )

lazy val geoLib =
  (project in file("lib/scala/geo"))
    .dependsOn(baseLib % "compile->compile;test->test")
    .disablePlugins(AssemblyPlugin)
    .settings(
      name := "twxplore-geo-lib",
      skip in publish := true
    )

lazy val treeCli = (project in file("cli/tree"))
  .dependsOn(treeLib)
  .enablePlugins(AssemblyPlugin)
  .settings(
    assemblyMergeStrategy in assembly := {
      case "logback.xml" => MergeStrategy.first
      case "module-info.class" => MergeStrategy.discard // Jackson has many of these, not needed
      case PathList("javax", "activation", xs@_*) => MergeStrategy.first // Conflicting versions
      case PathList("javax", "xml", "bind", xs@_*) => MergeStrategy.first // Conflicting versions
      case PathList("META-INF", "versions", "9", "javax", "xml", "bind", "ModuleUtil.class") => MergeStrategy.first // Same as above
      case PathList("META-INF", "c.tld") => MergeStrategy.last // Part of the taglibs
      case PathList("org", "apache", "commons", "logging", xs@_*) => MergeStrategy.first // Pick jcl-over-slf4j
      case PathList("org", "apache", "taglibs", "standard", xs@_*) => MergeStrategy.last
      case x =>
        val oldStrategy = (assemblyMergeStrategy in assembly).value
        oldStrategy(x)
    },
    assemblyOutputPath in assembly := baseDirectory.value / "dist" / ("tree-cli.jar"),
    mainClass in assembly := Some("io.github.tetherlessworld.twxplore.cli.tree.TreeCli"),
    libraryDependencies ++= Seq(
      "com.github.tototoshi" %% "scala-csv" % "1.3.6",
      "com.beust" % "jcommander" % "1.78",
      "edu.rpi.tw.twks" % "twks-direct-client" % twksVersion,
      "edu.rpi.tw.twks" % "twks-factory" % twksVersion,
      "org.slf4j" % "slf4j-simple" % slf4jVersion
    ),
    name := "tree-cli",
    skip in publish := true
  )

lazy val treeLib =
  (project in file("lib/scala/tree"))
    .dependsOn(baseLib % "compile->compile;test->test", geoLib)
    .disablePlugins(AssemblyPlugin)
    .settings(
      name := "twxplore-tree-lib",
      libraryDependencies ++= Seq(
        "com.github.tototoshi" %% "scala-csv" % "1.3.6",
      ),
      skip in publish := true
    )

lazy val treeApp = (project in file("app/tree"))
  .dependsOn(treeLib % "compile->compile;test->test")
  .disablePlugins(AssemblyPlugin)
  .enablePlugins(PlayScala)
  .settings(
    libraryDependencies ++= Seq(
    ),
    name := "tree-app",
    routesGenerator := InjectedRoutesGenerator,
    // Adds additional packages into Twirl
    //TwirlKeys.templateImports += "com.example.controllers._"

    // Adds additional packages into conf/routes
    // play.sbt.routes.RoutesKeys.routesImport += "com.example.binders._"
    skip in publish := true
  )
