package edu.rpi.tw.twxplore.cli.tree.command

import java.nio.file.Paths
import java.util.Date

import util.control.Breaks._
import com.beust.jcommander.{Parameter, Parameters}
import com.typesafe.scalalogging.Logger
import edu.rpi.tw.twxplore.lib.geo.models.domain.{Alive, Block, Borough, BranchLights, BranchOther, BranchShoe, CensusTract, City, CurbLoc, Damage, Dead, Fair, Good, Guards, Harmful, Health, Helpful, MetalGrates, NTA, NYCParksStaff, NoDamage, OffsetFromCurb, OnCurb, OneOrTwo, Poor, Postcode, Problems, RootGrate, RootLights, RootOther, RootStone, Sidewalk, Sneakers, State, Status, Steward, Stones, Stump, ThreeOrFour, Tree, TreeSpecies, TreesCountStaff, TrunkLights, TrunkOther, TrunkWire, Unsure, UserType, Volunteer, WiresRope, ZipCity}

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

object EtlCommand extends Command {
  @Parameters(commandDescription = "Run an extract-transform-load (ETL) pipeline")
  class Args {
    @Parameter(names = Array("-o", "--data-directory-path"))
    var dataDirectoryPath: String = "data"

    @Parameter(description = "pipeline name", required = true)
    var pipelineName: String = null
  }

  val args = new Args()

  def replaceComma(str: String, startIndex: Int, endIndex: Int): String = {
    val result: String = str.substring(0, startIndex) + str.substring(startIndex+1, endIndex).replace(",", "+") + str.substring(endIndex+1)
    result
  }

  def apply(): Unit = {
    val pipelineName = args.pipelineName.toLowerCase()
    val dataDirectoryPath = Paths.get(args.dataDirectoryPath)
    val source = scala.io.Source.fromFile(args.dataDirectoryPath)
    var treeList: ListBuffer[Tree] = new ListBuffer[Tree]()
    var treeSpeciesList: mutable.HashMap[String, TreeSpecies] = new mutable.HashMap()
    var boroughList: mutable.HashMap[Int, Borough] = new mutable.HashMap()
    var ntaList: mutable.HashMap[String, NTA] = new mutable.HashMap()
    var blockList: mutable.HashMap[Int, Block] = new mutable.HashMap()
    var postalCode: mutable.HashMap[Int, Postcode] = new mutable.HashMap()
    val state: State = State("New York", new ListBuffer[City])
    val city: City = City("New York City", new ListBuffer[Borough], new ListBuffer[Postcode], state.state)
    state.cities += city
    var line_no = 0

    for(line <- source.getLines) {
      line_no += 1
      breakable {
        if(line_no == 1)
          break
        val problemStart: Int = line.indexOf("\"")
        var cols: Array[String] = new Array[String](3)
        if (problemStart != -1) {
          val problemEnd: Int = line.indexOf("\"", problemStart + 1)
          val new_line = replaceComma(line, problemStart, problemEnd)
          cols = new_line.split(",", -1).map(_.trim)
        } else {
          cols = line.split(",", -1).map(_.trim)
        }

        val treeId: Int = cols(0).toInt
        val dateFormatter = new java.text.SimpleDateFormat("MM/d/yyyy")
        val createdAt: Date = dateFormatter.parse(cols(2))
        val treeDbh: Int = cols(3).toInt
        val stumpDia: Int = cols(4).toInt

        val curbLoc: CurbLoc = cols(5) match {
          case "OnCurb" => OnCurb
          case "OffsetFromCurb" => OffsetFromCurb
        }

        val status: Status = cols(6) match {
          case "Alive" => Alive
          case "Dead" => Dead
          case "Stump" => Stump
        }

        val health: Option[Health] = cols(7) match {
          case "Fair" => Some(Fair)
          case "Good" => Some(Good)
          case "Poor" => Some(Poor)
          case _ => None
        }

        val treeSpecies: Option[TreeSpecies] = treeSpeciesList.get(cols(8)) match {
          case Some(t) => Some(t)
          case _ => {
            val newTreeSpecies: Option[TreeSpecies] = cols(8) match {
              case "" => None
              case _ => {
                val tempSpecies = Some(TreeSpecies(cols(8), cols(9)))
                treeSpeciesList += (cols(8) -> tempSpecies.get)
                tempSpecies
              }
            }
            newTreeSpecies
          }
        }



        val steward: Option[Steward] = cols(10) match {
          case "1or2" => Some(OneOrTwo)
          case "3or4" => Some(ThreeOrFour)
          case _ => None
        }

        val guards: Option[Guards] = cols(11) match {
          case "Helpful" => Some(Helpful)
          case "Harmful" => Some(Harmful)
          case "Unsure" =>  Some(Unsure)
          case _ => None
        }

        val sidewalk: Option[Sidewalk] = cols(12) match {
          case "NoDamage" => Some(NoDamage)
          case "Damage" => Some(Damage)
          case _ => None
        }

        val userType: UserType = cols(13) match {
          case "TreesCount Staff" => TreesCountStaff
          case "Volunteer" => Volunteer
          case "NYC Parks Staff" => NYCParksStaff
        }

        val problems = cols(14).split("\\+").map(_.trim)
        var problemList: ListBuffer[Option[Problems]] = new ListBuffer[Option[Problems]]()
        if (problems(0) != "") {
          for (item <- problems) {
            val problem: Option[Problems] = item match {
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
              case "None" => None
            }
            problemList += problem
          }
        }

        val address: String = cols(24)
        val postcode: Postcode = postalCode.get(cols(25).toInt) match {
          case Some(p) => p
          case _ => Postcode(cols(25).toInt, city)
        }

        val zipCity: ZipCity = ZipCity(cols(26))
        val borough: Borough = boroughList.get(cols(28).toInt) match {
          case Some(b) => b
          case _ => Borough(cols(29), cols(28).toInt, new ListBuffer[NTA])
        }
        val community: Int = cols(27).toInt

        val cncldist: Int = cols(30).toInt
        val nta: NTA = ntaList.get(cols(33)) match {
          case Some(n) => n
          case _ => NTA(cols(33), cols(34), new ListBuffer[Block], borough.borough, cols(25).toInt, community, cncldist)
        }

        val block: Block = blockList.get(cols(1).toInt) match {
          case Some(b) => b
          case _ => Block(cols(1).toInt, nta.nta)
        }

        if(!boroughList.contains(cols(28).toInt)) {
          city.boroughs += borough
          boroughList += (cols(28).toInt -> borough)
        }

        if(!blockList.contains(cols(1).toInt)){
          nta.blocks += block
          blockList += (cols(1).toInt -> block)
        }

        if(!ntaList.contains(cols(33))) {
          borough.ntaList += nta
          ntaList += (cols(33)-> nta)
        }

        val stateAssembly: Int = cols(31).toInt
        val stateSenate: Int = cols(32).toInt
        val boro_ct: Int = cols(35).toInt
        val latitude: Float = cols(37).toFloat
        val longitude: Float = cols(38).toFloat
        val x_sp: Float = cols(39).toFloat
        val y_sp: Float = cols(40).toFloat
        val censusTract: Option[CensusTract] = cols(42) match {
          case "" => None
          case _ =>  Some(CensusTract(cols(42).toInt, "none"))
        }
        val bin: Option[Int] = cols(43) match {
          case "" => None
          case _ => Some(cols(43).toInt)
        }
        val bbl: Option[Long] = cols(44) match {
          case "" => None
          case _ => Some(cols(44).toLong)
        }

        val Tree: Tree = new Tree(treeId,
          createdAt,
          treeDbh,
          stumpDia,
          block,
          curbLoc,
          status,
          health,
          treeSpecies,
          steward,
          guards,
          sidewalk,
          userType,
          problemList,
          address,
          postcode,
          zipCity,
          community,
          borough,
          cncldist,
          stateAssembly,
          stateSenate,
          nta,
          boro_ct,
          state,
          latitude,
          longitude,
          x_sp,
          y_sp,
          censusTract,
          bin,
          bbl
        )
        treeList += Tree
      }
    }

    println(treeSpeciesList)
    println(s"There are ${treeSpeciesList.size} different tree species!")
//    val pipeline = Pipelines.pipelines.get(pipelineName)
//    if (!pipeline.isDefined) {
//      logger.error(s"no such pipeline `${pipelineName}`, valid: ${Pipelines.pipelines.keySet.mkString(" ")}")
//      return
//    }
//
//    val model = ModelFactory.createDefaultModel()
//
//    val dataDirectoryPath = Paths.get(args.dataDirectoryPath)
//
//    val extractedDataDirectoryPath = dataDirectoryPath.resolve("extracted").resolve(pipelineName)
//    Files.createDirectories(extractedDataDirectoryPath)
//
//    pipeline.get.extractor.extract(extractedDataDirectoryPath)
//
//    val transformedDataDirectoryPath = dataDirectoryPath.resolve("transformed").resolve(pipelineName)
//    Files.createDirectories(transformedDataDirectoryPath)
//    val transformedFilePath = transformedDataDirectoryPath.resolve(pipelineName + ".ttl")
//
//    for (thing <- pipeline.get.transformer.transform(extractedDataDirectoryPath)) {
//      thing.toResource(model)
//    }
//
//    val fileWriter = new FileWriter(transformedFilePath.toFile)
//    try {
//      model.write(fileWriter, "TURTLE")
//    } finally {
//      fileWriter.close()
//    }
  }

  private val logger = Logger(getClass.getName)
  val name = "etl"
}
