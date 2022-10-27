<?php

namespace Drupal\rest_api\Plugin\rest\resource;

use Drupal\core\Controller\FlagController;
use Drupal\core\Controller\UserController;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\node\Entity\Node;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use Drupal\rest_api\Controller\Utility\ValidationController;
use Drupal\user\Entity\User;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "usefull_resource_api",
 *   label = @Translation("Api to set usefull status in documents"),
 *   uri_paths = {
 *     "create" = "/api/item/{id}/usefull"
 *   }
 * )
 */
class UsefullApiController extends ResourceBase
{
  /**
   * A current user instance.
   *
   * @var AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Constructs a Drupal\rest\Plugin\ResourceBase object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param LoggerInterface $logger
   *   A logger instance.
   * @param AccountProxyInterface $current_user
   *   A current user instance.
   */
  public function __construct(
    array                 $configuration,
                          $plugin_id,
                          $plugin_definition,
    array                 $serializer_formats,
    LoggerInterface       $logger,
    AccountProxyInterface $current_user
  )
  {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition)
  {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('example_rest'),
      $container->get('current_user')
    );
  }

  private const JSON_SCHEMA = [
    'type' => 'object',
    'properties' => [
      'status' => [
        'type' => 'integer',
        'required' => true
      ]
    ]
  ];

  /**
   * Responds to POST requests.
   *
   * Returns a list of bundles for specified entity.
   *
   * @param Request $req
   * @param int $id
   * @return JsonResponse
   */
  public function post(Request $req, int $id)
  {
    try {
      if (empty($id)) {
        throw new Exception('USAC02: Missing node id', 400);
      }

      $userId = $req->headers->get('drupal-user-id') ?? '';
      $userGroups = $req->headers->get('role-groups') ?? '';
      $route = $req->get('_route');

      $body = json_decode($req->getContent());
      ValidationController::validateRequestBody($body, self::JSON_SCHEMA);

      $node = Node::load($id);
      if (empty($node)) {
        throw new Exception('USAC03: Invalid node id', 400);
      }

      if (!UserController::checkAuthGroups($userGroups, $route, $node->bundle())) {
        throw new Exception('USAC06: User unauthorized', 401);
      }

      $status = $body->status;
      if ($status < 1 || $status > 2) {
        throw new Exception('USAC04: Invalid useful status', 400);
      }

      $flag = FlagController::flag('usefull', $node, User::load($userId));

      FlagController::setFlagStatus($flag, $status);

      return ResponseFormatterController::success([
        'id' => $id
      ]);
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage());
    }
  }
}
