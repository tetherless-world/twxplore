package io.github.tetherlessworld.twxplore.lib.tree.models.selection

import edu.rpi.tw.twks.uri.Uri

final case class SelectionArea(name: String, uri: Uri, selection: String, parent: Uri)
