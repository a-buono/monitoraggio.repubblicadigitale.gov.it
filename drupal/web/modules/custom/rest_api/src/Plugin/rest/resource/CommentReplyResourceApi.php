<?php

namespace Drupal\rest_api\Plugin\rest\resource;

use Drupal\banned_words\Controller\BannedWordsController;
use Drupal\comment\Entity\Comment;
use Drupal\core\Controller\CommentController;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\node\Entity\Node;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use Drupal\rest_api\Controller\Utility\ValidationController;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "reply_create",
 *   label = @Translation("Api to create a reply to a comment"),
 *   uri_paths = {
 *     "create" = "/api/comment/{id}/reply"
 *   }
 * )
 */
class CommentReplyResourceApi extends ResourceBase
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
      'comment_body' => [
        'type' => 'string',
        'minLength' => 1,
        'required' => true
      ]
    ]
  ];

  /**
   * Responds to POST requests.
   *
   * @param Request $req
   * @param null $id
   * @return JsonResponse
   */
  public function post(Request $req, $id = null)
  {
    try {
      if (empty($id)) {
        throw new Exception('CMRRA02: Missing node id', 400);
      }

      $body = json_decode($req->getContent());
      ValidationController::validateRequestBody($body, self::JSON_SCHEMA);

      $comment = Comment::load($id);
      if (empty($comment) || !empty($comment->getParentComment())) {
        throw new Exception('CMRRA03: Invalid comment id', 400);
      }

      $nodeId = $comment->getCommentedEntityId();
      $node = Node::load($nodeId);
      if (empty($node) || $node->bundle() != 'community_item') {
        throw new Exception('CMRRA04: Invalid node id', 400);
      }

      if (!$node->get('field_enable_comments')->value) {
        throw new Exception('CMRRA05: Comments are not enabled for this node', 400);
      }

      if (!BannedWordsController::validateText($body->comment_body)) {
        throw new Exception('CMRRA06: Comment body contains banned words', 400);
      }

      $userId = $req->headers->get('drupal-user-id') ?? '';

      $commentId = CommentController::replyCreate(
        $nodeId,
        $id,
        $userId,
        $body->comment_body
      );

      return ResponseFormatterController::success([
        'id' => $commentId
      ]);
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage(), $ex->getCode());
    }
  }
}
