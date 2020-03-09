package io.github.tetherlessworld.twxplore.lib.cli

import com.beust.jcommander.{JCommander, Parameter}
import nl.grons.metrics4.scala.DefaultInstrumented

trait Cli extends DefaultInstrumented {
  val commands: List[Command]

  class GlobalArgs {
    @Parameter(names = Array("-h", "--help"))
    var help: Boolean = false
  }

  def main(args: Array[String]): Unit = {
    val commands = this.commands.map(command => (command.name, command)).toMap
    val jCommanderBuilder = JCommander.newBuilder()
    val globalArgs = new GlobalArgs
    jCommanderBuilder.addObject(globalArgs)
    for (command <- commands.values) {
      jCommanderBuilder.addCommand(command.name, command.args)
    }
    val jCommander = jCommanderBuilder.build()

    println(args.mkString(" "))
    jCommander.parse(args:_*)

    if (globalArgs.help) {
      jCommander.usage()
      return
    }

    val commandName = jCommander.getParsedCommand
    if (commandName == null) {
      jCommander.usage()
      return
    }

    import java.util.concurrent.TimeUnit

    import com.codahale.metrics.ConsoleReporter
    val reporter = ConsoleReporter.forRegistry(metricRegistry).build
    reporter.start(5, TimeUnit.SECONDS)

    val command = commands(commandName)
    command()

    reporter.report()
  }
}
