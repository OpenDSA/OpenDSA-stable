﻿#! /usr/bin/python
#
# Given an OpenDSA config file as a parameter, this script ensures all required fields are present and no invalid options are present
import re
import sys
import os
import json
import collections
from urlparse import urlparse

error_count = 0

required_fields = ['chapters', 'code_dir', 'module_origin', 'title']

optional_fields = ['allow_anonymous_credit', 'assumes', 'av_origin', 'av_root_dir', 'backend_address', 'build_dir', 'build_JSAV', 'build_ODSA', 'exercise_origin', 'exercises_root_dir', 'glob_jsav_exer_options', 'req_full_ss', 'start_chap_num', 'suppress_todo', 'theme', 'theme_dir']


def process_path(path, abs_prefix):
  """Converts relative to absolute paths and all paths to Unix-style paths"""

  # If the path is relative, make it absolute
  if not os.path.isabs(path):
    path = ''.join([abs_prefix, path])

  # Convert to Unix path
  path = path.replace("\\", "/")
  # Ensure path ends with '/'
  if not path.endswith('/'):
    path += '/'

  return path


def get_odsa_dir():
  """Calculate the path to the OpenDSA root directory based on the location of this file"""

  # Auto-detect ODSA directory
  (odsa_dir, script) = os.path.split(os.path.abspath(__file__))

  # Convert to Unix-style path and move up a directory
  # (assumes configure.py is one level below root OpenDSA directory)
  return os.path.abspath(odsa_dir.replace("\\", "/") + '/..') + '/'


# Error message handling based on validate_json.py (https://gist.github.com/byrongibson/1921038)
def parse_error(err):
  """
  "Parse" error string (formats) raised by (simple)json:
  '%s: line %d column %d (char %d)'
  '%s: line %d column %d - line %d column %d (char %d - %d)'
  """
  return re.match(r"""^
      (?P<msg>.+):\s+
      line\ (?P<lineno>\d+)\s+
      column\ (?P<colno>\d+)\s+
      (?:-\s+
        line\ (?P<endlineno>\d+)\s+
        column\ (?P<endcolno>\d+)\s+
      )?
      \(char\ (?P<pos>\d+)(?:\ -\ (?P<end>\d+))?\)
  $""", err, re.VERBOSE)


def validate_origin(origin, origin_type):
  """Validate the protocol, domain, and path of an origin"""
  global error_count

  parsed = urlparse(origin)
  if parsed.scheme not in ['http', 'https']:
    print 'ERROR: Invalid ' + origin_type + '_origin protocol, ' + parsed.scheme
    error_count += 1

  if parsed.netloc == '':
    print 'ERROR: Invalid ' + origin_type + '_origin domain, ' + parsed.netloc
    error_count += 1

  if parsed.path not in ['', '/']:
    print 'ERROR: Invalid ' + origin_type + '_origin path' + parsed.path
    error_count += 1


def validate_exercise(exer_name, exercise):
  """Validate an exercise object"""
  global error_count

  # Ensure exercise name is <= the max length of the Exercise name field in the database
  max_length = 50
  if len(exer_name) > max_length:
    print 'ERROR: ' + exer_name + ' is greater than ' + max_length + ' characters'
    error_count += 1

  required_fields = []
  optional_fields = ['jsav_exer_options', 'long_name', 'points', 'remove', 'required', 'showhide', 'threshold']

  # Ensure required fields are present
  for field in required_fields:
    if field not in exercise:
      print 'ERROR: Exercise, ' + exer_name + ', is missing required field, ' + field
      error_count += 1

  # Ensure there are no invalid fields in the module
  for field in exercise:
    if field not in (required_fields + optional_fields):
      print 'ERROR: Unknown field, ' + field + ', found in exercise ' + exer_name
      error_count += 1


# Validate a module
def validate_module(mod_name, module):
  """Validate a module object"""
  global error_count

  required_fields = ['exercises']
  optional_fields = ['long_name', 'dispModComp']

  # Ensure required fields are present
  for field in required_fields:
    if field not in module:
      print 'ERROR: Module, ' + mod_name + ', is missing required field, ' + field
      error_count += 1

  # Ensure there are no invalid fields in the module
  for field in module:
    if field not in (required_fields + optional_fields):
      print 'ERROR: Unknown field, ' + field + ', found in module ' + mod_name
      error_count += 1

  # Check validity of exercises
  if 'exercises' in module:
    for exer in module['exercises']:
      validate_exercise(exer, module['exercises'][exer])


# Validate a section
def validate_section(section):
  """Validate a chapter or section"""
  for subsect in section:
    is_mod = 'exercises' in section[subsect]

    if section[subsect] == {}:
      print 'WARNING: Section ' + subsect + ' is empty'
      continue
    elif not is_mod:
      for field in section[subsect]:
        if type(section[subsect][field]) != type(collections.OrderedDict()):
          is_mod = True
          break

    if is_mod:
      # Subsect is a module
      validate_module(subsect, section[subsect])
    else:
      validate_section(section[subsect])


# Validate an OpenDSA configuration file
def validate_config_file(config_file_path, conf_data):
  """Open the specified config file, parse it as JSON and validate the overall settings"""
  global error_count

  print "\nValidating " + config_file_path + '\n'

  # Ensure all required fields are present
  for field in required_fields:
    if field not in conf_data:
      print 'ERROR: Required field missing, ' + field
      error_count += 1

  if 'module_origin' in conf_data:
    validate_origin(conf_data['module_origin'], 'module');
  else:
    # Create a default module_origin for later processing
    conf_data['module_origin'] = ''

  # Ensure optional fields are configured properly
  if 'backend_address' in conf_data and not conf_data['backend_address'].startswith('https'):
    print 'WARNING: "backend_address" should use HTTPS'

  if 'av_origin' in conf_data:
    validate_origin(conf_data['av_origin'], 'av');

    # av_origin does not match the module origin, but av_root_dir does not point to a remote system
    if ('av_root_dir' not in conf_data or not conf_data['av_root_dir'].startswith('http')) and conf_data['av_origin'] != conf_data['module_origin']:
      print 'ERROR: av_root_dir is local but av_origin does not match module_origin'
      error_count += 1

  if 'exercise_origin' in conf_data:
    validate_origin(conf_data['exercise_origin'], 'exercise');

    # exercise_origin does not match the module origin, but exercise_root_dir does not point to a remote system
    if ('exercise_root_dir' not in conf_data or not conf_data['exercise_root_dir'].startswith('http')) and conf_data['exercise_origin'] != conf_data['module_origin']:
      print 'ERROR: exercise_root_dir is local but exercise_origin does not match module_origin'
      error_count += 1

  # Display an error message and exit if 'av_root_dir' is an absolute pathname to a remote system and its domain doesn't match 'module_origin' or 'av_origin' (or 'av_origin' isn't specified)
  if 'av_root_dir' in conf_data and conf_data['av_root_dir'].startswith('http') and not conf_data['av_root_dir'].startswith(conf_data['module_origin']) and ('av_origin' not in conf_data or not conf_data['av_root_dir'].startswith(conf_data['av_origin'])):
    error_count += 1

    if 'av_origin' not in conf_data:
      print 'ERROR: "av_origin" not specified when "av_root_dir" points to a remote system'
    else:
      print 'ERROR: "av_origin" does not match domain of remote "av_root_dir"'

  # Display an error message and exit if 'exercises_root_dir' is an absolute pathname to a remote system and its domain doesn't match 'module_origin' or 'exercise_origin' (or 'exercise_origin' isn't specified)
  if 'exercises_root_dir' in conf_data and conf_data['exercises_root_dir'].startswith('http') and not conf_data['exercises_root_dir'].startswith(conf_data['module_origin']) and ('exercise_origin' not in conf_data or not conf_data['exercises_root_dir'].startswith(conf_data['exercise_origin'])):
    error_count += 1

    if 'exercise_origin' not in conf_data:
      print 'ERROR: "exercise_origin" not specified when "exercises_root_dir" points to a remote system'
    else:
      print 'ERROR: "exercise_origin" does not match domain of remote "exercises_root_dir"'

  # Ensure the config file doesn't have any unknown fields (catches mis-spelled fields when config file is manually edited)
  for field in conf_data:
    if field not in (required_fields + optional_fields):
      print 'ERROR: Unknown field, ' + field
      error_count += 1

  validate_section(conf_data['chapters'])

  if error_count > 0:
    print 'Errors found: ' + str(error_count) + '\n'
    sys.exit(1)


def set_defaults(conf_data):
  """Assign default values to optional config attributes"""

  odsa_dir = get_odsa_dir()

  conf_data['code_dir'] = process_path(conf_data['code_dir'], odsa_dir)

  # Allow anonymous credit by default
  if 'allow_anonymous_credit' not in conf_data:
    conf_data['allow_anonymous_credit'] = True

  # 'assumes' does not need to be initialized

  # Assume exercises are hosted on same domain as modules
  if 'av_origin' not in conf_data:
    conf_data['av_origin'] = conf_data['module_origin']

  # 'exercises_root_dir' should default to the OpenDSA root directory
  if 'av_root_dir' not in conf_data:
    conf_data['av_root_dir'] = odsa_dir

  # If no backend address is specified, use an empty string to specify a disabled server
  if 'backend_address' not in conf_data:
    conf_data['backend_address'] = ''

  # Strip the '/' from the end of the SERVER_URL
  conf_data['backend_address'] = conf_data['backend_address'].rstrip('/')

  if 'build_dir' not in conf_data:
    conf_data['build_dir'] = 'Books'

  # 'build_JSAV' does not need to be initialized

  if 'build_ODSA' not in conf_data:
   conf_data['build_ODSA'] = True

  # Assume exercises are hosted on same domain as modules
  if 'exercise_origin' not in conf_data:
    conf_data['exercise_origin'] = conf_data['module_origin']

  # 'exercises_root_dir' should default to the OpenDSA root directory
  if 'exercises_root_dir' not in conf_data:
    conf_data['exercises_root_dir'] = odsa_dir

  # If not global exercise options are specified, defer to exercise-specific options or the defaults in odsaAV.js
  if 'glob_jsav_exer_options' not in conf_data:
    conf_data['glob_jsav_exer_options'] = {}

  if 'start_chap_num' not in conf_data:
    conf_data['start_chap_num'] = 0 #1

  if 'suppress_todo' not in conf_data:
    conf_data['suppress_todo'] = False

  # Require slideshows to be fully completed for credit by default
  if 'req_full_ss' not in conf_data:
    conf_data['req_full_ss'] = True

  if 'theme' not in conf_data:
    conf_data['theme'] = 'haiku'

  if 'theme_dir' not in conf_data:
    conf_data['theme_dir'] = '%sRST/source/_themes' % odsa_dir


class ODSA_Config:
  def __getitem__(self, key):
    return self.__dict__[key]

  def __setitem__(self, key, value):
    self.__dict__[key] = value

  def __init__(self, config_file_path):
    """Initializes an ODSA_Config object by reading in the JSON config file, setting default values, and validating the configuration"""
    # Throw an error if the specified config files doesn't exist
    if not os.path.exists(config_file_path):
      print "ERROR: File " + config_file_path + " doesn't exist\n"
      sys.exit(1)

    # Try to read the configuration file data as JSON
    try:
      with open(config_file_path) as config:
        # Force python to maintain original order of JSON objects (or else the chapters and modules will appear out of order)
        conf_data = json.load(config, object_pairs_hook=collections.OrderedDict)
    except ValueError, err:
      # Error message handling based on validate_json.py (https://gist.github.com/byrongibson/1921038)
      msg = err.message
      print msg

      if msg == 'No JSON object could be decoded':
        print 'ERROR: ' + config_file_path + ' is not a valid JSON file or does not use a supported encoding\n'
      else:
        err = parse_error(msg).groupdict()
        # cast int captures to int
        for k, v in err.items():
          if v and v.isdigit():
            err[k] = int(v)

        with open(config_file_path) as config:
          lines = config.readlines()

        for ii, line in enumerate(lines):
          if ii == err["lineno"] - 1:
            break

        print """
        %s
        %s^-- %s
        """ % (line.replace("\n", ""), " " * (err["colno"] - 1), err["msg"])

      # TODO: Figure out how to get (simple)json to accept different encodings
      sys.exit(1)

    # Assign defaults to optional settings
    set_defaults(conf_data)

    # Make sure the config file is valid
    validate_config_file(config_file_path, conf_data)

    # Convert the Python booleans to JavaScript booleans
    conf_data['allow_anonymous_credit'] = str(conf_data['allow_anonymous_credit']).lower()
    conf_data['req_full_ss'] = str(conf_data['req_full_ss']).lower()

    # Make conf_data publically available
    for field in required_fields:
      self[field] = conf_data[field]

    for field in optional_fields:
      self[field] = conf_data[field] if field in conf_data else None

    #
    self.config_file_path = config_file_path

    # Parse the name of the config file to use as the book name
    self.book_name = os.path.basename(config_file_path).replace('.json', '')

    # Parse the code language from the code directory path
    self.code_lang = os.path.basename(self.code_dir[:-1]).lower()

    # Treat Processing as Java (special case)
    if self.code_lang =='processing':
      self.code_lang = 'java'

    self.odsa_dir = get_odsa_dir()

    # Set the output directories needed for the build process
    # The directory for the entire book
    self.book_dir = '%s%s/' % (process_path(self.build_dir, self.odsa_dir), self.book_name)

    # The directory from which Sphinx will read the RST files
    self.book_src_dir = self.book_dir + 'source/'

    # The directory within the book directory where Sphinx will write the HTML files
    self.rel_book_output_path = 'html/'


# Code to execute when run as a standalone program
if __name__ == "__main__":
  # Process script arguments
  if len(sys.argv) != 2:
    print "Invalid config filename"
    print "Usage: " + sys.argv[0] + " config_file_path\n"
    sys.exit(1)

  ODSA_Config(sys.argv[1])
