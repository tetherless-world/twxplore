package io.github.tetherlessworld.twxplore.lib.tree.models.domain

import edu.rpi.tw.twks.uri.Uri

case class SelectionInput(
                         includeNtaList: Vector[Uri],
                         includeBlocks: Vector[Uri],
                         excludeNtaList: Vector[Uri],
                         excludeBlocks: Vector[Uri]
                         )
