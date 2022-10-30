const hex = (h) => {
  return h
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_, r, g, b) => "#" + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
};
// export function fillColor(canvas, x, y, new_color) {
//   const [r, g, b] = hex(new_color);
//   const newColor = { r, g, b, a: 1 };
//   // console.log("painting with", newColor);
//   let store = [{ x: x, y: y }];
//   let width = canvas.width;
//   let height = canvas.height;
//   const ctx = canvas.getContext("2d");
//   let id = ctx.getImageData(0, 0, width, height);
//   let curr_pixel_pos = (y * width + x) * 4;

//   //getting the color of current pixel
//   let start_r = id.data[curr_pixel_pos + 0];
//   let start_g = id.data[curr_pixel_pos + 1];
//   let start_b = id.data[curr_pixel_pos + 2];
//   let start_a = id.data[curr_pixel_pos + 3];

//   //if new color is same as old, no need to paint :)
//   if (
//     newColor.r === start_r &&
//     newColor.g === start_g &&
//     newColor.b === start_b &&
//     newColor.a === start_a
//   ) {
//     return;
//   }

//   color(curr_pixel_pos);
//   while (store.length) {
//     let curr_point = store.pop();
//     let x = curr_point.x,
//       y = curr_point.y;
//     let new_pos = (y * width + x - 1) * 4;
//     if (x > 1 && matches_start_color(new_pos)) {
//       color(new_pos);
//       store.push({ x: x - 1, y: y });
//     }
//     new_pos = (y * width + x + 1) * 4;
//     if (x < width - 1 && matches_start_color(new_pos)) {
//       color(new_pos);
//       store.push({ x: x + 1, y: y });
//     }
//     new_pos = ((y - 1) * width + x) * 4;
//     if (y > 1 && matches_start_color(new_pos)) {
//       color(new_pos);
//       store.push({ x: x, y: y - 1 });
//     }
//     new_pos = ((y + 1) * width + x) * 4;
//     if (y < height - 1 && matches_start_color(new_pos)) {
//       color(new_pos);
//       store.push({ x: x, y: y + 1 });
//     }
//   }
//   // console.log(id);
//   ctx.putImageData(id, 0, 0);
//   function matches_start_color(curr_pixel_pos) {
//     return (
//       id.data[curr_pixel_pos + 0] === start_r &&
//       id.data[curr_pixel_pos + 1] === start_g &&
//       id.data[curr_pixel_pos + 2] === start_b &&
//       id.data[curr_pixel_pos + 3] === start_a
//     );
//   }

//   function color(curr_pixel_pos) {
//     id.data[curr_pixel_pos + 0] = newColor.r;
//     id.data[curr_pixel_pos + 1] = newColor.g;
//     id.data[curr_pixel_pos + 2] = newColor.b;
//     id.data[curr_pixel_pos + 3] = newColor.a;
//   }
//   return id;
// }

export function fillColor(canvas, ctx, x, y, newColor) {
  function change(data) {
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 1;
      data[i + 2] = 1;
      data[i + 3] = 1;
    }
  }
  let c_width = canvas.width;
  let c_height = canvas.height;
  let id = ctx.getImageData(0, 0, c_width, c_height);
  change(id.data);
  ctx.putImageData(id, 0, 0);
  return;
  const fill_r = 25;
  const fill_g = 10;
  const fill_b = 12;
  const fill_a = 13;
  let stack = [[x, y]];
  const cid = id;
  let pixel_pos = (y * c_width + x) * 4;
  let start_r = id.data[pixel_pos + 0];
  let start_g = id.data[pixel_pos + 1];
  let start_b = id.data[pixel_pos + 2];
  let start_a = id.data[pixel_pos + 3];

  if (
    fill_r === start_r &&
    fill_g === start_g &&
    fill_b === start_b &&
    fill_a === start_a
  ) {
    return;
  }

  while (stack.length) {
    let new_pos, x, y, pixel_pos, reach_left, reach_right;
    new_pos = stack.pop();
    x = new_pos[0];
    y = new_pos[1];

    pixel_pos = (y * c_width + x) * 4;
    while (matches_start_color(pixel_pos)) {
      y--;
      pixel_pos = (y * c_width + x) * 4;
    }
    reach_left = false;
    reach_right = false;
    while (true) {
      y++;
      pixel_pos = (y * c_width + x) * 4;

      if (!(y < c_height && matches_start_color(pixel_pos))) {
        break;
      }

      color_pixel(pixel_pos);

      if (x > 0) {
        if (matches_start_color(pixel_pos - 4)) {
          if (!reach_left) {
            stack.push([x - 1, y]);
            reach_left = true;
          }
        } else if (reach_left) {
          reach_left = false;
        }
      }

      if (x < c_width - 1) {
        if (matches_start_color(pixel_pos + 4)) {
          if (!reach_right) {
            stack.push([x + 1, y]);
            reach_right = true;
          }
        } else if (reach_right) {
          reach_right = false;
        }
      }

      pixel_pos += c_width * 4;
    }
  }
  // ctx.clearRect(0, 0, c_width, c_height);
  ctx.putImageData(id, 0, 0);
  console.log(id.data);
  if (id === cid) console.log("game ho i");
  function matches_start_color(pixel_pos) {
    return (
      id.data[pixel_pos + 0] === start_r &&
      id.data[pixel_pos + 1] === start_g &&
      id.data[pixel_pos + 2] === start_b &&
      id.data[pixel_pos + 3] === start_a
    );
  }

  function color_pixel(pixel_pos) {
    id.data[pixel_pos + 0] = fill_r;
    id.data[pixel_pos + 1] = fill_g;
    id.data[pixel_pos + 2] = fill_b;
    id.data[pixel_pos + 3] = fill_a;
  }
}
