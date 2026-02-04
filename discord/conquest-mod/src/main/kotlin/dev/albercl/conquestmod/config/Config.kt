package dev.albercl.conquestmod.config

data class Config(
    val endpoint: String = "http://localhost:3000/members/link",
    val timeoutSeconds: Long = 5
)