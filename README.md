# Bouncing Canvas Mask

Creating Bouncing Canvas Mask

## Getting Started

```
<canvas
	class="canvas"
	width="200"
	height="200"
    data-src="http://loremflickr.com/320/320?random=1"
    data-intensity="0.2"
    data-random="true"
>
```

--------------------
Mandatory Attributes
--------------------
data-src: String (URL)

--------------------
Optional Attributes
--------------------
data-intensity: Number (default set to 0.3)
data-url: String (URL) – Add URL you want to redirect with click/touch
data-random: Boolean – If you set, the images on data-src are swapped randomly among the elements which has data-random

- Make sure to add width and height on <canvas>
- Please image URL in `data-src`
- Set the intensity of the movement of the element on data-intensity
- The images are swapped among the elements with data-random="true"
- [DEMO](https://stoneshower.github.io/bouncingmask/ "DEMO")

### Prerequisites

Works with >= IE9

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
