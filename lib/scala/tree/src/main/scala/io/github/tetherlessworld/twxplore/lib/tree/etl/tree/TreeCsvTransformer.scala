package io.github.tetherlessworld.twxplore.lib.tree.etl.tree

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.etl.CsvTransformer
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE
import nl.grons.metrics4.scala.DefaultInstrumented

import scala.collection.mutable
import scala.io.BufferedSource

class TreeCsvTransformer(bufferSize: Int = CsvTransformer.BufferSizeDefault) extends CsvTransformer with DefaultInstrumented {
  val uri = TREE.resourceURI
  private var treeSpeciesMap: mutable.HashMap[String, TreeSpecies] = new mutable.HashMap()
  private var boroughMap: mutable.HashMap[Int, Borough] = new mutable.HashMap()
  private var ntaMap: mutable.HashMap[String, Nta] = new mutable.HashMap()
  private var blockMap: mutable.HashMap[Int, Block] = new mutable.HashMap()
  private var postalCode: mutable.HashMap[Int, Postcode] = new mutable.HashMap()
  private var zipCityMap: mutable.HashMap[String, ZipCity] = new mutable.HashMap()
  private var censusTractMap: mutable.HashMap[Int, CensusTract] = new mutable.HashMap()
  private var city: City = City("New York City", List[Uri](), List[Uri](), Uri.parse(TREE.STATE_URI_PREFIX + ":" + "New_York"), Uri.parse(TREE.FEATURE_URI_PREFIX + ":" + "New_York"), Uri.parse(TREE.CITY_URI_PREFIX + ":" + "New York City".replace(" ", "_")))
  private var state: State = State("New York", List[Uri](), Uri.parse(TREE.STATE_URI_PREFIX + ":" + "New York".replace(" ", "_")))

  def parseCsv(filename: String, sink: TreeCsvTransformerSink): Unit = {
    {
      val source: BufferedSource = openCsvSource(filename)
      try {
        for ((line, line_no) <- source.getLines.zipWithIndex) {
          line_no match {
            case 0 =>
            case _ => {
              processRegions(line)
            }
          }
        }

        generateNTAList()
        generateBoroughList()
        generateCityList()
      } finally {
        source.close()
      }
    }

    {
      val source: BufferedSource = openCsvSource(filename)
      val meter = metrics.meter(filename)
      try {
        for ((line, lineIndex) <- source.getLines.zipWithIndex) {
          if (lineIndex > 0) {
            val problemStart: Int = line.indexOf("\"")
            var cols: Array[String] = new Array[String](3)
            if (problemStart != -1) {
              val problemEnd: Int = line.indexOf("\"", problemStart + 1)
              val new_line = replaceComma(line, problemStart, problemEnd)
              cols = new_line.split(",", -1).map(_.trim)
            } else {
              cols = line.split(",", -1).map(_.trim)
            }
            val tree = process(line)
            sink.accept(tree)
            meter.mark()
            if (lineIndex % bufferSize == 0) {
              sink.flush()
            }
          }
        }
      } finally {
        source.close()
      }
    }

    sink.flush()

    sink.accept(city)
    sink.accept(state)

    def acceptValues[T](acceptCall: T => Unit, metricName: String, values: Iterable[T]): Unit = {
      val counter = metrics.counter(metricName)
      for (value <- values) {
        counter.inc()
        acceptCall(value)
      }
    }

    acceptValues((value: Nta) => sink.accept(value), "nta", ntaMap.values)
    acceptValues((value: Borough) => sink.accept(value), "borough", boroughMap.values)
    acceptValues((value: Block) => sink.accept(value), "block", blockMap.values)
    acceptValues((value: Postcode) => sink.accept(value), "postalCode", postalCode.values)
    acceptValues((value: ZipCity) => sink.accept(value), "city", zipCityMap.values)
    acceptValues((value: TreeSpecies) => sink.accept(value), "species", treeSpeciesMap.values)
    acceptValues((value: CensusTract) => sink.accept(value), "censusTract", censusTractMap.values)

    sink.flush()
  }

  private def replaceComma(str: String, startIndex: Int, endIndex: Int): String = {
    str.substring(0, startIndex) + str.substring(startIndex + 1, endIndex).replace(",", "+") + str.substring(endIndex + 1)
  }

  private def processRegions(line: String): Unit = {
    val cols = convertToCols(line)
    processPostcode(cols(25))
    processBorough(cols(29), cols(28))
    processNTA(cols(33), cols(34), cols(28).toInt, cols(25).toInt)
    processBlock(cols(1), cols(33))
  }

  private def generateNTAList(): Unit = {
    for ((key, nta) <- ntaMap) {
      val boroughId = nta.borough.toString.substring(nta.borough.toString.lastIndexOf(":") + 1).toInt
      boroughMap(boroughId) = boroughMap(boroughId).addNTA(nta)
    }
  }

  private def generateBoroughList(): Unit = {
    for ((key, borough) <- boroughMap) {
      city = city.addBorough(borough)
    }
  }

  private def generateCityList(): Unit = state = state.addCity(city)

  private def process(line: String): Tree = {
    val cols = convertToCols(line)

    domain.Tree(
      id = processTreeId(cols(0)),
      createdAt = processCreatedAt(cols(2)),
      dbh = processDBH(cols(3)),
      stump = processStumpDiameter(cols(4)),
      block = processBlock(cols(1), cols(33)).uri,
      curbLoc = processCurbLoc(cols(5)),
      status = processStatus(cols(6)),
      health = processHealth(cols(7)),
      species = {
        val speciesObj = processTreeSpecies(cols(8), cols(9))
        speciesObj match {
          case None => None
          case _ => Some(speciesObj.get.uri)
        }
      },
      steward = processSteward(cols(10)),
      guards = processGuards(cols(11)),
      sidewalk = processSidewalk(cols(12)),
      userType = processUserType(cols(13)),
      problems = processProblems(cols(14)),
      address = processAddress(cols(24)),
      postcode = processPostcode(cols(25)).uri,
      city = city.uri,
      zipCity = processZipCity(cols(26)).uri,
      community = processCommunity(cols(27)),
      borough = processBorough(cols(29), cols(28)).uri,
      cncldist = processCouncilDistrict(cols(30)),
      stateAssembly = processStateAssembly(cols(31)),
      stateSenate = processStateSenate(cols(32)),
      NTA = processNTA(cols(33), cols(34), cols(28).toInt, cols(25).toInt).uri,
      boroughCount = processBoroCt(cols(35)),
      state = state.uri,
      latitude = processLatitude(cols(37)),
      longitude = processLongitude(cols(38)),
      x_sp = processXStatePlane(cols(39)),
      y_sp = processYStatePlane(cols(40)),
      censusTract = {
        val censusTractObj = processCensusTract(cols(42))
        censusTractObj match {
          case None => None
          case _ => Some(censusTractObj.get.uri)
        }
      },
      bin = processBin(cols(43)),
      bbl = processBBL(cols(44)),
      uri = Uri.parse(TREE.TREE_URI_PREFIX + ":" + cols(0))
    )
  }

  private def processAddress(address: String): String = address

  private def processBBL(bbl: String): Option[Long] = {
    bbl match {
      case "" => None
      case _ => Some(bbl.toLong)
    }
  }

  private def processBin(bin: String): Option[Int] = {
    bin match {
      case "" => None
      case _ => Some(bin.toInt)
    }
  }

  private def processBlock(block: String, nta: String): Block = {
    blockMap.get(block.toInt) match {
      case Some(b) => b
      case _ => {
        val new_block = Block(block.toInt, block, Uri.parse(uri + "NTA:" + nta), Uri.parse(TREE.FEATURE_URI_PREFIX + ":" + block), Uri.parse(TREE.BLOCK_URI_PREFIX + ":" + block))
        ntaMap(nta) = ntaMap(nta).addBlock(new_block)
        blockMap += (block.toInt -> new_block)
        new_block
      }
    }
  }

  private def processBoroCt(boro_ct: String): Int = boro_ct.toInt

  private def processBorough(borough_str: String, borocode: String): Borough = {
    boroughMap.get(borocode.toInt) match {
      case Some(b) => b
      case _ => {
        val borough = Borough(borough_str, borocode.toInt, city.uri, List[Uri](), Uri.parse(TREE.FEATURE_URI_PREFIX + ":" + borough_str.replace(" ", "_")), Uri.parse(TREE.BOROUGH_URI_PREFIX + ":" + borocode))
        boroughMap += (borocode.toInt -> borough)
        borough
      }
    }
  }

  private def processCensusTract(censusTract: String): Option[CensusTract] = {
    censusTract match {
      case "" => None
      case _ => {
        censusTractMap.get(censusTract.toInt) match {
          case Some(n) => Some(n)
          case _ => {
            val newCensusTract = CensusTract(censusTract.toInt, "lol", Uri.parse(TREE.CENSUSTRACT_URI_PREFIX + ":" + censusTract))
            censusTractMap += (censusTract.toInt -> newCensusTract)
            Some(newCensusTract)
          }
        }
      }
    }
  }

  private def processCouncilDistrict(cncldist: String): Int = cncldist.toInt

  private def processCommunity(community: String): Int = community.toInt

  private def processCreatedAt(date: String): Date = {
    val dateFormatter = new java.text.SimpleDateFormat("MM/d/yyyy")
    dateFormatter.parse(date)
  }

  private def processCurbLoc(curbLoc: String): CurbLoc =
    CurbLoc.values.find(value => value.toString == curbLoc).get

  private def processDBH(dbh: String): Int = dbh.toInt

  private def processGuards(guards: String): Option[Guards] =
    Guards.values.find(value => value.toString == guards)

  private def processHealth(health: String): Option[Health] =
    Health.values.find(value => value.toString == health)

  private def processLatitude(latitude: String): Float = latitude.toFloat

  private def processLongitude(longitude: String): Float = longitude.toFloat

  private def processNTA(nta: String, ntaName: String, borough: Int, postCode: Int): Nta = {
    ntaMap.get(nta) match {
      case Some(n) => n
      case _ => {
        val boroughUri = Uri.parse(uri + "borough:" + borough.toString)
        val postcodeUri = Uri.parse(uri + "postcode:" + postCode.toString)
        val new_nta = Nta(nta, ntaName, List[Uri](), boroughUri, postcodeUri, Uri.parse(TREE.FEATURE_URI_PREFIX + ":" + ntaName.replace(" ", "_")), Uri.parse(TREE.NTA_URI_PREFIX + ":" + nta))
        ntaMap += (nta -> new_nta)
        new_nta
      }
    }
  }

  private def processPostcode(postcode: String): Postcode = {
    postalCode.get(postcode.toInt) match {
      case Some(p) => p
      case _ => {
        val new_postcode = Postcode(postcode.toInt, city.uri, Uri.parse(TREE.POSTCODE_URI_PREFIX + ":" + postcode.toString))
        city = city.addPostcode(new_postcode)
        postalCode += (postcode.toInt -> new_postcode)
        new_postcode
      }
    }
  }

  private def processProblems(problems: String): List[Problems] =
    problems.split("\\+").map(_.trim).flatMap(problem => Problems.values.find(value => value.toString == problem)).toList

  private def processSidewalk(sidewalk: String): Option[Sidewalk] =
    Sidewalk.values.find(value => value.toString == sidewalk)

  private def processStateAssembly(stateAssembly: String): Int = stateAssembly.toInt

  private def processStateSenate(stateSenate: String): Int = stateSenate.toInt

  private def processStatus(status: String): Status =
    Status.values.find(value => value.toString == status).get

  private def processSteward(steward: String): Option[Steward] =
    Steward.values.find(value => value.toString == steward)

  private def processStumpDiameter(dia: String): Int = dia.toInt

  private def processTreeId(treeId: String): Int = treeId.toInt

  private def processTreeSpecies(ltn_name: String, cmn_name: String) = {
    treeSpeciesMap.get(ltn_name) match {
      case Some(t) => Some(t)
      case _ => {
        ltn_name match {
          case "" => None
          case _ => {
            val tempSpecies = Some(TreeSpecies(cmn_name, ltn_name, Uri.parse(TREE.SPECIES_URI_PREFIX + ":" + cmn_name.replace(" ", "_"))))
            treeSpeciesMap += (cmn_name -> tempSpecies.get)
            tempSpecies
          }
        }
      }
    }
  }

  private def processUserType(userType: String): UserType =
    userType match {
      case "TreesCount Staff" => UserType.TreesCountStaff
      case "Volunteer" => UserType.Volunteer
      case "NYC Parks Staff" => UserType.NYCParksStaff
      case _ => throw new IllegalArgumentException(userType)
    }

  private def processXStatePlane(x_sp: String): Float = x_sp.toFloat

  private def processYStatePlane(y_sp: String): Float = y_sp.toFloat

  private def processZipCity(zipcity: String): ZipCity = {
    zipCityMap.get(zipcity) match {
      case Some(z) => z
      case _ => {
        val zipCity: ZipCity = ZipCity(zipcity, Uri.parse(TREE.ZIPCITY_URI_PREFIX + ":" + zipcity.replace(" ", "_")))
        zipCityMap += (zipcity -> zipCity)
        zipCity
      }
    }
  }

  private def convertToCols(line: String): Array[String] = {
    val problemStart: Int = line.indexOf("\"")
    var cols: Array[String] = new Array[String](3)
    if (problemStart != -1) {
      val problemEnd: Int = line.indexOf("\"", problemStart + 1)
      val new_line = replaceComma(line, problemStart, problemEnd)
      cols = new_line.split(",", -1).map(_.trim)
    } else {
      cols = line.split(",", -1).map(_.trim)
    }
    cols
  }
}
