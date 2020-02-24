package io.github.tetherlessworld.twxplore.cli.tree.command

trait Command {
  def apply(): Unit

  val args: AnyRef
  val name: String
}
