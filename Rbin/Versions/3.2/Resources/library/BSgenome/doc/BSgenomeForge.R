### R code from vignette source 'BSgenomeForge.Rnw'

###################################################
### code chunk number 1: BSgenomeForge.Rnw:192-195
###################################################
library(Biostrings)
file <- system.file("extdata", "ce2chrM.fa.gz", package="BSgenome")
fasta.info(file)


###################################################
### code chunk number 2: BSgenomeForge.Rnw:428-439
###################################################
library(BSgenome)
seed_files <- system.file("extdata", "GentlemanLab", package="BSgenome")
tail(list.files(seed_files, pattern="-seed$"))

## Display seed file for musFur1:
musFur1_seed <- list.files(seed_files, pattern="\\.musFur1-seed$", full.names=TRUE)
cat(readLines(musFur1_seed), sep="\n")

## Display seed file for rn4:
rn4_seed <- list.files(seed_files, pattern="\\.rn4-seed$", full.names=TRUE)
cat(readLines(rn4_seed), sep="\n")


###################################################
### code chunk number 3: BSgenomeForge.Rnw:452-454 (eval = FALSE)
###################################################
## library(BSgenome)
## forgeBSgenomeDataPkg("path/to/my/seed")


###################################################
### code chunk number 4: BSgenomeForge.Rnw:677-682
###################################################
library(BSgenome)
seed_files <- system.file("extdata", "GentlemanLab", package="BSgenome")
tail(list.files(seed_files, pattern="\\.masked-seed$"))
rn4_masked_seed <- list.files(seed_files, pattern="\\.rn4\\.masked-seed$", full.names=TRUE)
cat(readLines(rn4_masked_seed), sep="\n")


###################################################
### code chunk number 5: BSgenomeForge.Rnw:697-699 (eval = FALSE)
###################################################
## library(BSgenome)
## forgeMaskedBSgenomeDataPkg("path/to/my/seed")


###################################################
### code chunk number 6: BSgenomeForge.Rnw:741-742
###################################################
sessionInfo()


