#!/usr/bin/env python
"""Barreling Utility for React Native Typescript implementation
------------------------------------------------------------------------------
Author: HU JIAJUN
Email: e0556371@u.nus.edu
------------------------------------------------------------------------------

Place the following in header comment:
@barrel ignore        in index.ts for a directory
                      if the directory should not have a generated index.ts

@barrel export all    if the file exports multiple objects

@barrel hook          if the file should be exporting as a React hook
                      (i.e. getting symbol `useFile` from `File.ts`)

Assumptions:
  - All .ts files contain an export that is the same as the name of the file

  - All .ts files with "@barrel export all" have all exports exported under an
    object with the same name as the file.

  - Directory values in IGNORED_DIRECTORIES are ignored

  - ".json" files are ignored.

  - All files to be barreled contain a file extension ".ts" or ".tsx". The 
    file name should be of form <ExportedObjectName>.ts or 
    <ExportedObjectName>.tsx.
"""

import os

SOURCE_ROOT = 'src'
IGNORED_DIRECTORIES = [
    "__mocks__",  # jest mock implementations
    "__tests__",  # jest tests
    "__snapshots__",  # jest snapshots
    "assets"
]

def clean(directory):
    print("Cleaning %s" % (directory))
    files = os.listdir(directory)

    clean_directory = False

    if "index.ts" in files:
        clean_directory = True
        with open("%s/index.ts" % (directory), mode="r", encoding="UTF-8") \
                as f:
            for line in f:
                if "@barrel ignore" in line:
                    clean_directory = False

    if clean_directory:
        print("removing %s/index.ts" % (directory))
        os.remove("%s/index.ts" % (directory))

    for subdir in files:
        if os.path.isdir("%s/%s" % (directory, subdir)) \
                and subdir not in IGNORED_DIRECTORIES:
            clean("%s/%s" % (directory, subdir))


def barrel(directory):
    print("Barrelling %s" % (directory))

    files = os.listdir(directory)
    barrel_directory = True

    index_ts = """/* eslint-disable prettier/prettier */
// GENERATED CODE: DO NOT EDIT!

"""

    to_barrel = []

    if "index.ts" in files:
        with open("%s/index.ts" % (directory), mode="r", encoding="UTF-8") \
                as f:
            for line in f:
                if "@barrel ignore" in line:
                    barrel_directory = False

    for filename in files:
        obj_name = filename

        if (
            not os.path.isdir("%s/%s" % (directory, filename)) and
            not (
                filename.endswith(".ts") or
                filename.endswith(".tsx")
            ) or filename in IGNORED_DIRECTORIES
        ):
            print("Skipping %s" % (filename))
            continue

        if filename != "index.ts":
            if not (filename.endswith(".ts") or filename.endswith(".tsx")):
                if barrel("%s/%s" % (directory, filename)):
                    to_barrel += [(obj_name, "*", [obj_name], [])]
            else:
                obj_name = filename.replace(".tsx", "").replace(".ts", "")

                with open(
                    "%s/%s" % (directory, filename),
                    mode="r",
                    encoding="UTF-8"
                ) as f:
                    export_all = False
                    export_as_hook = False
                    other_exports = set()
                    ignore_export = False

                    for line in f:
                        if "@barrel ignore" in line:
                            ignore_export = True
                        elif "@barrel export all" in line:
                            export_all = True
                        elif "@barrel export" in line:
                            exports = line.split(
                                "@barrel export ")[-1].split(",")
                            for export in exports:
                                other_exports.add(export.strip())

                        if "@barrel hook" in line:
                            export_as_hook = True

                        if "@barrel stylesheet" in line:
                            other_exports.add("I%sStyleSheet" % (obj_name,))

                        if "@barrel component" in line:
                            if " type" in line:
                                other_exports.add("%sProps" % (obj_name,))
                            elif " noprops" not in line:
                                other_exports.add("I%sProps" % (obj_name,))

                            if " action" in line:
                                other_exports.add("%sAction" % (obj_name,))

                            if " dispatch" in line:
                                other_exports.add(
                                    "%sDispatchAction" % (obj_name,))

                            if line.startswith(" * @file"):
                                docstring = line.replace(
                                    " * @file", "").strip()

                    imports = sorted(
                        ["use%s" % (obj_name) if export_as_hook else obj_name]
                        + list(other_exports), key=lambda x: x.lower()
                    )

                    if ignore_export:
                        continue

                    if export_all:
                        to_barrel += [(obj_name, "*",
                                       [obj_name], other_exports)]
                    elif len(imports) == 1:
                        to_barrel += [(obj_name, " " +
                                       imports[0] + " ", imports, [])]
                    else:
                        to_barrel += [
                            (
                                obj_name, 
                                "\n" 
                                + (
                                    "".join([("  " + s + ",\n") \
                                        for s in imports])
                                ), 
                                imports, 
                                []
                            )
                        ]

    if to_barrel and barrel_directory:
        imports = ""
        export_consts = ""
        exports = "export {\n"
        default_export = ""
        export_list = []

        for (obj, importstr, line_exports, passthrough) \
                in sorted(to_barrel, key=lambda x: x[0].lower()):
            to_import = ""

            if importstr == "*":
                to_import = "import * as %s from './%s';" % (obj, obj)
            else:
                to_import = "import {%s} from './%s';" % (importstr, obj)

            to_import_lines = to_import.split("\n")

            for line in to_import_lines:
                imports += "%s\n" % (line)

            export_list += line_exports

            for p in passthrough:
                line = "export const %s = %s.%s;\n" % (p, obj, p)
                export_consts += line

        export_list = sorted(export_list, key=lambda x: x.lower())
        exports += "".join([("  " + s + ",\n") for s in export_list]) + "};\n"

        export_consts = (
            export_consts + "\n") if export_consts else export_consts

        with open(
            "%s/index.ts" % (directory), 
            mode="w", 
            encoding="UTF-8",
            newline="\n"
        ) as f:
            f.write(index_ts)
            f.write(imports)
            f.write("\n")
            f.write(export_consts)
            f.write(exports)

        return True

    if barrel_directory and not to_barrel:
        return False

    return True


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        '--source', '-s',
        metavar='DIR',
        default=SOURCE_ROOT,
        help='root directory where React Native source codes are'
    )

    parser.add_argument(
        '--clean', '-c',
        help="cleans the barrel directory",
        action='store_true'
    )

    args = parser.parse_args()

    if args.clean:
        clean(args.source)
    else:
        barrel(args.source)
