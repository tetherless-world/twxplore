package io.github.tetherlessworld.twxplore.lib.tree.models.selection

import edu.rpi.tw.twks.uri.Uri

final case class SelectionInput(
                                 includeNtaList: Vector[Uri],
                                 includeBlocks: Vector[Uri],
                                 excludeNtaList: Vector[Uri],
                                 excludeBlocks: Vector[Uri]
                               )
