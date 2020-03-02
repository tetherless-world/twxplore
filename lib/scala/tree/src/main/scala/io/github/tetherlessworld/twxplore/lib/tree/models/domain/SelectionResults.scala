package io.github.tetherlessworld.twxplore.lib.tree.models.domain

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

final case class SelectionResults(
                                   blocks: List[Block],
                                   boroughs: List[Borough],
                                   censusTracts: List[CensusTract],
                                   city: City,
                                   ntaList: List[Nta],
                                   postcodes: List[Postcode],
                                   state: State,
                                   trees: List[Tree],
                                   treeSpecies: List[TreeSpecies],
                                   zipCities: List[ZipCity],
                                 )
