var CANVAS_WIDTH = 1360;
var CANVAS_HEIGHT = 768;

var CANVAS_WIDTH_HALF = CANVAS_WIDTH * 0.5;
var CANVAS_HEIGHT_HALF = CANVAS_HEIGHT * 0.5;

var EDGEBOARD_X = 175;
var EDGEBOARD_Y = 90;

var DISABLE_SOUND_MOBILE = false;
var FONT_GAME = "palamecia_titlingregular";

var FPS = 30;

var FPS_TIME = 1 / FPS;

var SNAKE_TYPES = 5;

var FRAMES_NUM_HELP = [null, 16, 17, 22];

var BUFFER_ANIM_MONITOR = [null, 80, 80, 80];

var PLAYER = 4;
var ENEMY_SNAKES = [0, 1, 2, 3];

var AI_PLAYER = 0;
var AI_FOODS = 1;

var COLLISION_OFFSET_FOOD = [{x: -20, y: -10}];

var REG_FOOD_OFFSET = [{x: -12, y: 0}];

var OPEN_MOUNTH_DISTANCE_RATE = 2;
var MOUNTH_OFFSET_DETECT = -50;
var EATEN_OFFSET_DETECT = -30;

var SNAKES_TOKEN_RADIUS_FOOD_DETECT = 10;

var STATE_LOADING = 0;
var STATE_MENU = 1;
var STATE_HELP = 1;
var STATE_GAME = 3;
var STATE_TUTORIAL = 4;

var STATE_INIT = 0;
var STATE_PLAY = 1;
var STATE_FINISH = 2;

var ON_MOUSE_DOWN = 0;
var ON_MOUSE_UP = 1;
var ON_MOUSE_OVER = 2;
var ON_MOUSE_OUT = 3;
var ON_DRAG_START = 4;
var ON_DRAG_END = 5;


var MENU_SNAKES_VELOCITY = 20;

var MENU_SNAKE_GOOD_ROTATION = 9;
var MENU_SNAKE_BAD_ROTATION = 5;

var MENU_SNAKE_GOOD_TIME_ROTATION = 150;
var MENU_SNAKE_BAD_TIME_ROTATION = 150;

var MENU_BAD_SNAKE_DELAY = 1500;

var WIDTH_OF_HORIZONTAL_RECT = 130;
var HEIGHT_OF_HORIZONTAL_RECT = 50;

var WIDTH_OF_VERTICAL_RECT = 60;
var HEIGHT_OF_VERTICAL_RECT = 320;

var MAX_AI_FOLLOW_PLAYER = 1;

var EATEN_FOOD_SNAKE_INTERVAL = 100;

var EDGES_PROPERTIES = {x: 0, y: 0, h: 2, w: 3, xMax: 0, yMax: 0};

var SCROLL_LIMIT = {xMin: -1712, yMin: -1330, xMax: 0, yMax: 0};

var PLAYER_CAMERA_OFFSET = {x: 680, y: 384};

var SPAWN_FOODS_RANGE = {xMin: EDGES_PROPERTIES.x + EDGEBOARD_X, yMin: EDGES_PROPERTIES.y + EDGEBOARD_Y, xMax: 2048, yMax: 1024};

var FIELD_SECTION_SUBDIVISION = {w: 5, h: 2, tot: 10}; //TOTAL SUBDIVIDIDED WITH FOOD  

var FOODS_OCCURRENCE = [100];

var MAX_FOODS_INSTANCE = 100;

var FOOD_STATE = [4];

var AI_SNAKES = [{type: ENEMY_SNAKES[0], x: 250, y: 250, time_follow: 2000},
    {type: ENEMY_SNAKES[1], x: 2762, y: 250, time_follow: 3000},
    {type: ENEMY_SNAKES[2], x: 250, y: 1798, time_follow: 2500},
    {type: ENEMY_SNAKES[3], x: 2762, y: 1798, time_follow: 3000}];


var MS_TIME_SHOW_WIN_PANEL = 1000;

var WAIT_TIME_UPDATE_POS_QUEUE = 30;

var START_QUEUE_SNAKES = [50, 40, 65, 80, 6];

var MS_DECREASE_TIME_EATEN_QUEUE = 250;

var LERP_RATE = 0.03;

var DISTANCE_SINGLE_QUEUE = 4;
var REG_Y_OFFSET_QUEUE = -36;

var INTERVAL_SPAWN_FOOD = 500;

var MS_FADE_TIME = 250;

var TIME_FOOD_SPAWN_ANIM = 1000;

var WAIT_TIME_SPAWN_QUEUE = 250;

var TIME_SPAWN_QUEUE = 1000;

var TIME_EATEN_EFFECT = 250;

var MAXT_TIME_WAIT_FOOD_SPAWN_ANIM = 250;

var MAX_AI_QUEUE_LENGTH = 100;

var SINGLE_QUEUE_RADIUS = 14;

var VERTICAL_RECT_STYLE_BLOCK;
var HORIZONTAL_RECT_STYLE_BLOCK;

var MAX_SECOND_FOR_ANIM_VERTICAL_RECT = 10;

var DISPLAY_SHOCK_X = 30;
var DISPLAY_SHOCK_Y = 50;

var DISTANCE_AI_DETECT_FOOD = 500;

var AI_ANGLE_DETECT_FOODS = 30 * (Math.PI / 180);

var COLLISION_DISTANCE_AI_PLAYER_FACTOR = 100;

var AI_TIME_CHANGE_DIR = {min: 2000, max: 5000};

var AI_TIME_IGNORE_PLAYER = 1000;

var AI_WAIT_TIME_FOR_CHANGE_DIR = {min: 250, max: 1000};

var CAN_PLAYER_EATEN_ENEMY = false;

var SHOW_COLLISION_SHAPE = false;

var SHOW_FIELD_OF_VIEW = false;

var SHOW_FOODS_ID = false;

var SHOW_SECTION_SHAPE = false;

var ALLOW_SPEED_UP = false;

var HERO_START_X = 1511;
var HERO_START_Y = 1024;

var HERO_ACCELLERATION;

var MAX_HERO_SPEED;
var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;