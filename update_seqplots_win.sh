#!/bin/sh
wine $(pwd)/app/Rwin/R-Portable/App/R-Portable/bin/x64/Rscript.exe -e "devtools::install_github('przemol/seqplots', build_vignettes=FALSE)"