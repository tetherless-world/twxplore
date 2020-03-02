package io.github.tetherlessworld.twxplore.lib.tree.models.selection

import edu.rpi.tw.twks.uri.Uri

final case class SelectionInput(
                                 includeNtaList: List[Uri],
                                 includeBlocks: List[Uri],
                                 excludeNtaList: List[Uri],
                                 excludeBlocks: List[Uri]
                               )
