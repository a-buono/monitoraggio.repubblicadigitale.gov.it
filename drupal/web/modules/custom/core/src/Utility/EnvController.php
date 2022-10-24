<?php

namespace Drupal\core\Utility;

use Drupal\Core\Site\Settings;
use Exception;

/**
 *
 */
class EnvController
{
  /**
   * @param $envKey
   * @return null
   */
  public static function getValues($envKey)
  {
    $envPath = Settings::get('custom_env_path');

    if (empty($envPath)) {
      throw new Exception('EC01: Invalid environment path');
    }

    $envContent = file_get_contents(__DIR__ . '/../../../../../' . $envPath) ?? null;

    if (empty($envContent)) {
      throw new Exception('EC02: Unable to load environment content');
    }

    $values = json_decode($envContent);

    if (empty($values)) {
      throw new Exception('EC03: Invalid environment json decoding');
    }

    $data = $values->$envKey ?? null;

    if (empty($data)) {
      throw new Exception('EC04: Invalid environment key');
    }

    return $data;
  }
}
