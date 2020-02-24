package models.selections

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Tree

case class TreeSelections(trees: List[Tree],
                       includeBoroughs: List[Uri],
                       excludeBoroughs: List[Uri],
                       includeNtas: List[Uri],
                       excludeNtas: List[Uri],
                       includeBlock: List[Uri],
                       excludeBlock: List[Uri])
