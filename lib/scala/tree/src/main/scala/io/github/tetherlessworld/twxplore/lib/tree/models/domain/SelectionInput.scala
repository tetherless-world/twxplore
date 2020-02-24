package io.github.tetherlessworld.twxplore.lib.tree.models.domain

import edu.rpi.tw.twks.uri.Uri

case class SelectionInput(
                         includeNtaList: List[Uri],
                         includeBlocks: List[Uri],
                         excludeNtaList: List[Uri],
                         excludeBlocks: List[Uri]
                         )
