/*
 * COSMO® CIA — Firmware v1.0
 * LOT Systems, Inc. | lot-systems.com
 * Inventor: Vadim Marmeladov
 *
 * Platform: ESP32-S3 / ESP-IDF v5.2 / FreeRTOS
 */

#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "freertos/queue.h"
#include "esp_system.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "nvs.h"

#include "wifi_manager.h"
#include "https_client.h"
#include "display.h"
#include "sensor_bme688.h"
#include "camera_ov2640.h"
#include "button.h"
#include "session_compress.h"
#include "ota.h"

static const char *TAG = "COSMO-CIA";

#define FIRMWARE_VERSION_STR  "1.0.0"
#define FIRMWARE_VERSION_INT  10000

/* Inter-task event group bits */
#define WIFI_CONNECTED_BIT    BIT0
#define WIFI_FAIL_BIT         BIT1
#define NOTIF_PENDING_BIT     BIT2

EventGroupHandle_t g_system_events;
QueueHandle_t g_button_queue;
QueueHandle_t g_notif_queue;

static void log_system_info(void) {
    ESP_LOGI(TAG, "Firmware %s (build %d)", FIRMWARE_VERSION_STR, FIRMWARE_VERSION_INT);
    ESP_LOGI(TAG, "Free heap: %lu bytes", esp_get_free_heap_size());
}

void app_main(void) {
    ESP_LOGI(TAG, "=== COSMO CIA BOOT ===");

    /* NVS init */
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    /* System event group */
    g_system_events = xEventGroupCreate();
    g_button_queue  = xQueueCreate(8, sizeof(button_event_t));
    g_notif_queue   = xQueueCreate(16, sizeof(notification_t));

    log_system_info();

    /* Hardware init */
    display_init();
    display_show_boot_logo();

    button_init(g_button_queue);
    sensor_bme688_init();
    camera_ov2640_init();
    session_compress_init();

    /* Start tasks */
    xTaskCreatePinnedToCore(wifi_manager_task,     "wifi",    4096, NULL, 5, NULL, 0);
    xTaskCreatePinnedToCore(https_client_task,     "https",   8192, NULL, 4, NULL, 0);
    xTaskCreatePinnedToCore(display_renderer_task, "display", 2048, NULL, 3, NULL, 1);
    xTaskCreatePinnedToCore(sensor_sampler_task,   "sensor",  2048, NULL, 3, NULL, 1);
    xTaskCreatePinnedToCore(camera_driver_task,    "camera",  4096, NULL, 2, NULL, 1);
    xTaskCreatePinnedToCore(button_handler_task,   "button",  1024, NULL, 6, NULL, 0);
    xTaskCreatePinnedToCore(ota_manager_task,      "ota",     4096, NULL, 1, NULL, 0);
    xTaskCreatePinnedToCore(session_compress_task, "session", 4096, NULL, 1, NULL, 0);

    ESP_LOGI(TAG, "All tasks started. Deleting app_main.");
    vTaskDelete(NULL);
}
