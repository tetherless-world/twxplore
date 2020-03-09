package io.github.tetherlessworld.twxplore.lib.cli

trait Command {
  def apply(): Unit

  val args: AnyRef
  val name: String
}
