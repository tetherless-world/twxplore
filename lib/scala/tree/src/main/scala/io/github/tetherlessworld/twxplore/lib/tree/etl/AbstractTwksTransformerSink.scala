package io.github.tetherlessworld.twxplore.lib.tree.etl

import edu.rpi.tw.twks.api.TwksClient

abstract class AbstractTwksTransformerSink(protected val twksClient: TwksClient) extends TransformerSink {
}
