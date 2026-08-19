// Temporary internal-validation patch. This tests whether running SWC hygiene
// after mangling repairs the duplicate-binding output from #97517.
import { readFileSync, writeFileSync } from 'node:fs'

const path = 'turbopack/crates/turbopack-ecmascript/src/minify.rs'
let source = readFileSync(path, 'utf8')

const before = `                    if mangle.is_none() {\n                        program.mutate(hygiene_with_config(hygiene::Config {\n                            top_level_mark,\n                            ..Default::default()\n                        }));\n                    }`
const after = `                    program.mutate(hygiene_with_config(hygiene::Config {\n                        top_level_mark,\n                        ..Default::default()\n                    }));`

const index = source.indexOf(before)
if (index === -1) {
  throw new Error('Could not find conditional post-minify hygiene block')
}
if (source.indexOf(before, index + before.length) !== -1) {
  throw new Error('Found multiple post-minify hygiene blocks')
}

source = source.slice(0, index) + after + source.slice(index + before.length)
writeFileSync(path, source)
