<?php
	/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    */
    // Author: Soulberto Lorenzo <slorenzot@gmail.com>
    // Seccion de Desarrollo
    // Oficina de Informatica y Telematica
    // UPTOS - Clodosbaldo Russián
    // Venezuela
	class net {
		public static function ipAddr() {
			$ip = '127.0.0.1';
			
			if(!empty($_SERVER['HTTP_CLIENT_IP'])) {
				$ip = $_SERVER['HTTP_CLIENT_IP'];
			} elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
				$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
			} else {
				if($_SERVER['REMOTE_ADDR'] !=='::1')
					$ip = $_SERVER['REMOTE_ADDR'];
			}
			
			return $ip;
		}
	}
	
	class Logger {
		public static function requireDir($dir) {
			if(!empty($dir) && !@dir($dir))
				mkdir($dir, 0777, true);
		}

		public static function store($sql, $user) {
			$path = getcwd();
			
			$file = sprintf("%s/../logs/%s.log", $path, date("Ymd"));
			$fp = fopen($file,"a+");
			$ip = net::ipAddr();
			fputs($fp, sprintf("%s %s %s: %s\r", date("h:i:s"), $ip, $user, $sql));
			fclose($fp);
		}
		
		public static function trace($msg, $user = 'nobody') {
			Logger::store('TRACE: '.$msg, $user);
		}

		public static function error($msg, $user = 'nobody') {
			Logger::store('ERROR: '.$msg, $user);
		}

		public static function info($msg, $user = 'nobody') {
			Logger::store('INFO: '.$msg, $user);
		}
		
		public static function log($msg, $user = 'nobody') {
			Logger::store($msg, $user);
		}
	}
	
	class XML {
		public static function parse($XML) {
			$xml_parser = xml_parser_create();
			xml_parse_into_struct($xml_parser, $XML, $vals);
			xml_parser_free($xml_parser);
			
			$_tmp='';
			foreach ($vals as $xml_elem) {
				$x_tag=$xml_elem['tag'];
				$x_level=$xml_elem['level'];
				$x_type=$xml_elem['type'];
				if ($x_level!=1 && $x_type == 'close') {
					if (isset($multi_key[$x_tag][$x_level]))
						$multi_key[$x_tag][$x_level]=1;
					else
						$multi_key[$x_tag][$x_level]=0;
				}
				if ($x_level!=1 && $x_type == 'complete') {
					if ($_tmp==$x_tag)
						$multi_key[$x_tag][$x_level]=1;
					$_tmp=$x_tag;
				}
			}
			// jedziemy po tablicy
			foreach ($vals as $xml_elem) {
				$x_tag=$xml_elem['tag'];
				$x_level=$xml_elem['level'];
				$x_type=$xml_elem['type'];
				if ($x_type == 'open')
					$level[$x_level] = $x_tag;
				$start_level = 1;
				$php_stmt = '$xml_array';
				if ($x_type=='close' && $x_level!=1)
					$multi_key[$x_tag][$x_level]++;
				while ($start_level < $x_level) {
					$php_stmt .= '[$level['.$start_level.']]';
					if (isset($multi_key[$level[$start_level]][$start_level]) && $multi_key[$level[$start_level]][$start_level])
						$php_stmt .= '['.($multi_key[$level[$start_level]][$start_level]-1).']';
					$start_level++;
				}
				$add='';
				if (isset($multi_key[$x_tag][$x_level]) && $multi_key[$x_tag][$x_level] && ($x_type=='open' || $x_type=='complete')) {
					if (!isset($multi_key2[$x_tag][$x_level]))
						$multi_key2[$x_tag][$x_level]=0;
					else
						$multi_key2[$x_tag][$x_level]++;
					$add='['.$multi_key2[$x_tag][$x_level].']';
				}
				if (isset($xml_elem['value']) && trim($xml_elem['value'])!='' && !array_key_exists('attributes', $xml_elem)) {
					if ($x_type == 'open')
						$php_stmt_main=$php_stmt.'[$x_type]'.$add.'[\'content\'] = $xml_elem[\'value\'];';
					else
						$php_stmt_main=$php_stmt.'[$x_tag]'.$add.' = $xml_elem[\'value\'];';
					eval($php_stmt_main);
				}
				if (array_key_exists('attributes', $xml_elem)) {
					if (isset($xml_elem['value'])) {
						$php_stmt_main=$php_stmt.'[$x_tag]'.$add.'[\'content\'] = $xml_elem[\'value\'];';
						eval($php_stmt_main);
					}
					foreach ($xml_elem['attributes'] as $key=>$value) {
						$php_stmt_att=$php_stmt.'[$x_tag]'.$add.'[$key] = $value;';
						eval($php_stmt_att);
					}
				}
			}
			return $xml_array;
		}
	}
?>