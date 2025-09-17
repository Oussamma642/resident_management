<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ImmeubleController;
use App\Http\Controllers\ProprietaireController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {

    // Immeuble APIs
    Route::controller(ImmeubleController::class)->group(function () {

        Route::middleware('is_syndic')->group(function () {
            Route::get('/immeubles', 'index');
            Route::get('/immeubles/auth-syndic', 'getImmeubleOfAuthSyndic');
            Route::post('/immeubles', 'store');
        });
    });

    // Proprietaire APIs
    Route::controller(ProprietaireController::class)->group(function () {

        Route::middleware('is_syndic')->group(function () {

            Route::get('/proprietaires', 'index');
            Route::get('/proprietaires/{id}', 'show');
            Route::post('/proprietaires', 'store');
            Route::put('/proprietaires/{id}', 'update');
            Route::delete('/proprietaires/{id}', 'destroy');
        });
    });

    // User Controller
    Route::controller(UserController::class)->group(function () {
        Route::get('/users/{id}', 'show');
        Route::put('/users/{id}', 'update');
        // Route::delete('/users/{id}', 'destroy')->middleware('is_syndic');
    });

    // Logout route
    Route::post("/logout", [AuthController::class, "logout"]);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
