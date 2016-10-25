context("Replacements")

test_that("basic replacement works", {
  expect_equal(str_replace_all("abababa", "ba", "BA"), "aBABABA")
  expect_equal(str_replace("abababa", "ba", "BA"), "aBAbaba")
})

test_that("replacement strings with capture groups refs and dollar signs work", {
  expect_equal(str_replace_all("abc$a$1$2", fixed("a"), "$1"), "$1bc$$1$1$2")
  expect_equal(str_replace("abc$a$1$2", fixed("a"), "$1"), "$1bc$a$1$2")

  expect_equal(str_replace_all("abcde", "(b)(c)(d)", "\\1"), "abe")
  expect_equal(str_replace_all("abcde", "(b)(c)(d)", "\\2"), "ace")
  expect_equal(str_replace_all("abcde", "(b)(c)(d)", "\\3"), "ade")

  # gsub("(b)(c)(d)", "\\0", "abcde", perl=TRUE) gives a0e,
  # in ICU regex $0 refers to the whole pattern match
  expect_equal(str_replace_all("abcde", "(b)(c)(d)", "\\0"), "abcde")

  # gsub("(b)(c)(d)", "\\4", "abcde", perl=TRUE) is legal,
  # in ICU regex this gives an U_INDEX_OUTOFBOUNDS_ERROR
  expect_error(
    str_replace_all("abcde", "(b)(c)(d)", "\\4"),
    "index that is out of bounds"
  )

  expect_equal(str_replace_all("abcde", "bcd", "\\\\1"), "a\\1e")

  expect_equal(str_replace_all("a!1!2!b", "!", "$"), "a$1$2$b")
  expect_equal(str_replace("aba", "b", "$"), "a$a")
  expect_equal(str_replace("aba", "b", "$$$"), "a$$$a")
  expect_equal(str_replace("aba", "(b)", "\\1$\\1$\\1"), "ab$b$ba")
  expect_equal(str_replace("aba", "(b)", "\\1$\\\\1$\\1"), "ab$\\1$ba")
  expect_equal(str_replace("aba", "(b)", "\\\\1$\\1$\\\\1"), "a\\1$b$\\1a")
})

test_that("can replace multiple matches", {
  x <- c("a1", "b2")
  y <- str_replace_all(x, c("a" = "1", "b" = "2"))
  expect_equal(y, c("11", "22"))
})

# fix_replacement ---------------------------------------------------------

test_that("$ are escaped", {
  expect_equal(fix_replacement("$"), "\\$")
  expect_equal(fix_replacement("\\$"), "\\\\$")
})

test_that("\1 converted to $1 etc", {
  expect_equal(fix_replacement("\\1"), "$1")
  expect_equal(fix_replacement("\\9"), "$9")
})

test_that("\\1 left as is", {
  expect_equal(fix_replacement("\\\\1"), "\\\\1")
})
