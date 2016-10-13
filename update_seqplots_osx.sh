#!/bin/sh
export RHOME=$(pwd)/app/Rmac/Resources
export R_HOME_DIR=$(pwd)/app/Rmac/Resources
$RHOME/bin/Rscript -e "devtools::install_github('przemol/seqplots', build_vignettes=FALSE)"