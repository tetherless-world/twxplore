package io.github.tetherlessworld.twxplore.cli.tree

import com.beust.jcommander.{JCommander, Parameter}
import io.github.tetherlessworld.twxplore.cli.tree.command.EtlCommand

object CliMain {

  class GlobalArgs {
    @Parameter(names = Array("-h", "--help"))
    var help: Boolean = false
  }

  def main(args: Array[String]): Unit = {
    val commands = Map(EtlCommand.name -> EtlCommand)
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

    val command = commands(commandName)
    command()
  }
}
