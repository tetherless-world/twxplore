package io.github.tetherlessworld.twxplore.lib.tree.models.domain

import edu.rpi.tw.twks.uri.Uri

case class SelectionArea(name: String, uri: Uri, selection: String, parent: Uri)
