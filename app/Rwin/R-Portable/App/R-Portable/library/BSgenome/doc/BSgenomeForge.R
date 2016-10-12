### R code from vignette source 'BSgenomeForge.Rnw'
### Encoding: ISO8859-1

###################################################
### code chunk number 1: BSgenomeForge.Rnw:193-196
###################################################
library(Biostrings)
file <- system.file("extdata", "ce2chrM.fa.gz", package="BSgenome")
fasta.seqlengths(file)


###################################################
### code chunk number 2: BSgenomeForge.Rnw:429-440
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
### code chunk number 3: BSgenomeForge.Rnw:453-455 (eval = FALSE)
###################################################
## library(BSgenome)
## forgeBSgenomeDataPkg("path/to/my/seed")


###################################################
### code chunk number 4: BSgenomeForge.Rnw:678-683
###################################################
library(BSgenome)
seed_files <- system.file("extdata", "GentlemanLab", package="BSgenome")
tail(list.files(seed_files, pattern="\\.masked-seed$"))
rn4_masked_seed <- list.files(seed_files, pattern="\\.rn4\\.masked-seed$", full.names=TRUE)
cat(readLines(rn4_masked_seed), sep="\n")


###################################################
### code chunk number 5: BSgenomeForge.Rnw:698-700 (eval = FALSE)
###################################################
## library(BSgenome)
## forgeMaskedBSgenomeDataPkg("path/to/my/seed")


###################################################
### code chunk number 6: BSgenomeForge.Rnw:742-743
###################################################
sessionInfo()


