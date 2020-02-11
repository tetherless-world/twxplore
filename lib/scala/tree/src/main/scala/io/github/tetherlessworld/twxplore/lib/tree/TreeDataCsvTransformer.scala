package io.github.tetherlessworld.twxplore.lib.tree

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import io.github.tetherlessworld.twxplore.lib.geo.models.domain
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

import scala.collection.mutable
import scala.io.BufferedSource

case class TreeDataCsvTransformer() {
  private def replaceComma(str: String, startIndex: Int, endIndex: Int): String = {
    str.substring(0, startIndex) + str.substring(startIndex+1, endIndex).replace(",", "+") + str.substring(endIndex+1)
  }
  private var treeSpeciesMap: mutable.HashMap[String, TreeSpecies] = new mutable.HashMap()
  private var boroughMap: mutable.HashMap[Int, Borough] = new mutable.HashMap()
  private var ntaMap: mutable.HashMap[String, Nta] = new mutable.HashMap()
  private var blockMap: mutable.HashMap[Int, Block] = new mutable.HashMap()
  private var postalCode: mutable.HashMap[Int, Postcode] = new mutable.HashMap()
  private var zipCityMap: mutable.HashMap[String, ZipCity] = new mutable.HashMap()
  private var censusTractMap: mutable.HashMap[Int, CensusTract] = new mutable.HashMap()
  private var city: City = City("New York City", List[Uri](), List[Uri](), Uri.parse(TREE.STATE_URI_PREFIX + "New_York"))
  private var state: State = State("New York", List[Uri]())
  val uri = TREE.resourceURI

  class LineProcessor {
    def processAddress(address: String): String = address

    def processBBL(bbl: String): Option[Long] = {
      bbl match {
        case "" => None
        case _ => Some(bbl.toLong)
      }
    }

    def processBin(bin: String): Option[Int] = {
      bin match {
        case "" => None
        case _ => Some(bin.toInt)
      }
    }

    def processBlock(block: String, nta: String): Block = {
      blockMap.get(block.toInt) match {
        case Some(b) => b
        case _ => {
          val new_block = Block(block.toInt, Uri.parse(uri + "NTA:" +nta))
          ntaMap(nta) = ntaMap(nta).addBlock(new_block)
          blockMap += ( block.toInt -> new_block)
          new_block
        }
      }
    }

    def processBoroCt(boro_ct: String): Int = boro_ct.toInt

    def processBorough(borough_str: String, borocode: String): Borough = {
      boroughMap.get(borocode.toInt) match {
        case Some(b) => b
        case _ => {
          val borough = Borough(borough_str, borocode.toInt, city.uri, List[Uri]())
          boroughMap += (borocode.toInt -> borough)
          borough
        }
      }
    }

    def processCensusTract(censusTract: String): Option[CensusTract] = {
      censusTract match {
        case "" => None
        case _ =>  {
          censusTractMap.get(censusTract.toInt) match {
            case Some(n) => Some(n)
            case _ => {
              val newCensusTract = CensusTract(censusTract.toInt, "lol")
              censusTractMap += (censusTract.toInt -> newCensusTract)
              Some(newCensusTract)
            }
          }
        }
      }
    }

    def processCouncilDistrict(cncldist: String): Int = cncldist.toInt

    def processCommunity(community: String): Int = community.toInt

    def processCreatedAt(date: String): Date = {
      val dateFormatter = new java.text.SimpleDateFormat("MM/d/yyyy")
      dateFormatter.parse(date)
    }

    def processCurbLoc(curbLoc: String): CurbLoc = {
      curbLoc match {
        case "OnCurb" => OnCurb
        case "OffsetFromCurb" => OffsetFromCurb
      }
    }

    def processDBH(dbh: String): Int = dbh.toInt

    def processGuards(guards: String): Option[Guards] = {
      guards match {
        case "Helpful" => Some(Helpful)
        case "Harmful" => Some(Harmful)
        case "Unsure" =>  Some(Unsure)
        case _ => None
      }
    }

    def processHealth(health: String): Option[Health] = {
      health match {
        case "Fair" => Some(Fair)
        case "Good" => Some(Good)
        case "Poor" => Some(Poor)
        case _ => None
      }
    }

    def processLatitude(latitude: String): Float = latitude.toFloat

    def processLongitude(longitude: String): Float = longitude.toFloat

    def processNTA(nta: String, ntaName: String, borough: Int, postCode: Int): Nta = {
      ntaMap.get(nta) match {
        case Some(n) => n
        case _ => {
          val boroughUri = Uri.parse(uri + "borough:" + borough.toString)
          val postcodeUri = Uri.parse(uri + "postcode:" + postCode.toString)
          val new_nta = Nta(nta, ntaName, List[Uri](), boroughUri, postcodeUri)
          ntaMap += (nta -> new_nta)
          new_nta
        }
      }
    }

    def processPostcode(postcode: String): Postcode = {
      postalCode.get(postcode.toInt) match {
        case Some(p) => p
        case _ => {
          val new_postcode = Postcode(postcode.toInt, city.uri)
          city = city.addPostcode(new_postcode)
          postalCode += (postcode.toInt -> new_postcode)
          new_postcode
        }
      }
    }

    def processProblems(problems_str: String): List[Problems] = {
      val problems = problems_str.split("\\+").map(_.trim).toList
      val problemList = problems.flatMap ({
        case "BranchLights" => Some(BranchLights)
        case "BranchOther" => Some(BranchOther)
        case "BranchShoe" => Some(BranchShoe)
        case "MetalGrates" => Some(MetalGrates)
        case "Stones" => Some(Stones)
        case "TrunkLights" => Some(TrunkLights)
        case "TrunkOther" => Some(TrunkOther)
        case "TrunkWire" => Some(TrunkWire)
        case "RootGrate" => Some(RootGrate)
        case "RootLights" => Some(RootLights)
        case "RootOther" => Some(RootOther)
        case "RootStone" => Some(RootStone)
        case "Sneakers" => Some(Sneakers)
        case "WiresRope" => Some(WiresRope)
        case _ => None
      })
      problemList
    }

    def processSidewalk(sidewalk: String): Option[Sidewalk] = {
      sidewalk match {
        case "NoDamage" => Some(NoDamage)
        case "Damage" => Some(Damage)
        case _ => None
      }
    }

    def processStateAssembly(stateAssembly: String): Int = stateAssembly.toInt

    def processStateSenate(stateSenate: String): Int = stateSenate.toInt

    def processStatus(status: String): Status = {
      status match {
        case "Alive" => Alive
        case "Dead" => Dead
        case "Stump" => Stump
      }
    }

    def processSteward(steward: String): Option[Steward] = {
      steward match {
        case "1or2" => Some(OneOrTwo)
        case "3or4" => Some(ThreeOrFour)
        case _ => None
      }
    }

    def processStumpDiameter(dia: String): Int = dia.toInt

    def processTreeId(treeId: String): Int = treeId.toInt

    def processTreeSpecies(ltn_name: String, cmn_name: String) = {
      treeSpeciesMap.get(ltn_name) match {
        case Some(t) => Some(t)
        case _ => {
          ltn_name match {
            case "" => None
            case _ => {
              val tempSpecies = Some(TreeSpecies(ltn_name, cmn_name))
              treeSpeciesMap += (ltn_name -> tempSpecies.get)
              tempSpecies
            }
          }
        }
      }
    }

    def processUserType(userType: String): UserType = {
      userType match {
        case "TreesCount Staff" => TreesCountStaff
        case "Volunteer" => Volunteer
        case "NYC Parks Staff" => NYCParksStaff
      }
    }

    def processXStatePlane(x_sp: String): Float = x_sp.toFloat

    def processYStatePlane(y_sp: String): Float = y_sp.toFloat

    def processZipCity(zipcity: String): ZipCity = {
      zipCityMap.get(zipcity) match {
        case Some(z) => z
        case _ => {
          val zipCity: ZipCity = ZipCity(zipcity)
          zipCityMap += (zipcity -> zipCity)
          zipCity
        }
      }
    }

    def convertToCols(line: String): Array[String] = {
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

    def processRegions(line: String): Unit = {
      val cols = convertToCols(line)
      processPostcode(cols(25))
      processBorough(cols(29), cols(28))
      processNTA(cols(33), cols(34), cols(28).toInt, cols(25).toInt)
      processBlock(cols(1), cols(33))
    }

    def generateNTAList(): Unit = {

      for ((key, nta) <- ntaMap){
        val boroughId = nta.borough.toString.substring(nta.borough.toString.lastIndexOf(":")+ 1).toInt
        boroughMap(boroughId) = boroughMap(boroughId).addNTA(nta)
      }
    }

    def generateBoroughList(): Unit = {
      for ((key, borough) <- boroughMap){
        city = city.addBorough(borough)
      }
    }

    def generateCityList(): Unit = state = state.addCity(city)


    def process(line: String): Tree = {
      val cols = convertToCols(line)

      domain.Tree(
        id = processTreeId(cols(0)),
        createdAt = processCreatedAt(cols(2)),
        dbh = processDBH(cols(3)),
        stump = processStumpDiameter(cols(4)),
        block = processBlock(cols(1), cols(33)),
        curbLoc = processCurbLoc(cols(5)),
        status = processStatus(cols(6)),
        health = processHealth(cols(7)),
        species = processTreeSpecies(cols(8), cols(9)),
        steward = processSteward(cols(10)),
        guards = processGuards(cols(11)),
        sidewalk = processSidewalk(cols(12)),
        userType = processUserType(cols(13)),
        problems = processProblems(cols(14)),
        address = processAddress(cols(24)),
        postcode = processPostcode(cols(25)),
        city = city,
        zipCity = processZipCity(cols(26)),
        community = processCommunity(cols(27)),
        borough = processBorough(cols(29), cols(28)),
        cncldist = processCouncilDistrict(cols(30)),
        stateAssembly = processStateAssembly(cols(31)),
        stateSenate = processStateSenate(cols(32)),
        NTA = processNTA(cols(33), cols(34), cols(28).toInt, cols(25).toInt),
        boroughCount = processBoroCt(cols(35)),
        state = state,
        latitude = processLatitude(cols(37)),
        longitude = processLongitude(cols(38)),
        x_sp = processXStatePlane(cols(39)),
        y_sp = processYStatePlane(cols(40)),
        censusTract = processCensusTract(cols(42)),
        bin = processBin(cols(43)),
        bbl = processBBL(cols(44))
      )
    }
  }

  def parseCsv(filename: String, sink: TreeCsvTransformerSink): Unit = {
    //change it back to fromResource after you're done
    var source: BufferedSource = null
    if(sys.env.contains("CI")) {
      source = scala.io.Source.fromResource(filename)
    } else {
      try {
        source = scala.io.Source.fromResource(filename)
        source.getLines.zipWithIndex
      } catch {
        case _:Throwable => source = scala.io.Source.fromFile(filename)
      }
    }
    val lineProcessor = new LineProcessor()

    for((line, line_no) <- source.getLines.zipWithIndex) {
      line_no match {
        case 0 => {}
        case _ => {

          lineProcessor.processRegions(line)
        }
      }
    }

    lineProcessor.generateNTAList()
    lineProcessor.generateBoroughList()
    lineProcessor.generateCityList()

    source.close()
    var source2: BufferedSource = null
    if(sys.env.contains("CI")) {
      source2 = scala.io.Source.fromResource(filename)
    } else {
      try {
        source2 = scala.io.Source.fromResource(filename)
        source2.getLines.zipWithIndex
      } catch {
        case _:Throwable => source2 = scala.io.Source.fromFile(filename)
      }
    }
    for((line, line_no) <- source2.getLines.zipWithIndex) {
      line_no match {
        case 0 => {}
        case _ => {
          val problemStart: Int = line.indexOf("\"")
          var cols: Array[String] = new Array[String](3)
          if (problemStart != -1) {
            val problemEnd: Int = line.indexOf("\"", problemStart + 1)
            val new_line = replaceComma(line, problemStart, problemEnd)
            cols = new_line.split(",", -1).map(_.trim)
          } else {
            cols = line.split(",", -1).map(_.trim)
          }
          val tree = lineProcessor.process(line)
          sink.accept(tree)
        }
      }
    }
    sink.accept(city)
    sink.accept(state)
    for ((_, nta) <- ntaMap) sink.accept(nta)
    for ((_, borough) <- boroughMap) sink.accept(borough)
    for ((_, block) <- blockMap) sink.accept(block)
    for ((_, code) <- postalCode) sink.accept(code)
    for ((_, city) <- zipCityMap) sink.accept(city)
    for ((_, species) <- treeSpeciesMap) sink.accept(species)
    for ((_, census) <- censusTractMap) sink.accept(census)

    source2.close()
  }
}
