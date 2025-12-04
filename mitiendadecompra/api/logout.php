<?php
require 'config.php';
session_destroy();
jsonOut(['success'=>true]);
