#version 300 es

layout (location = 0) in vec2 aPosition;
uniform mat4 uMvpMatrix;

void main()
{
    gl_Position = uMvpMatrix * vec4(aPosition, 0.0, 1.0);
}
