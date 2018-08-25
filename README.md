# mastering_d3
Coursework for a D3 course hosted on Udemy

## d3 and local files
In order for d3 local file reads to work (d3.csv), make sure to do the following steps (from inside any 0x_subdir_name/app directory):
  1. npm install (make sure http-server is installed (package.json) as a dev dependency for local files)
  2. from another terminal/command line window, navigate to 0x_subdir_name/app
  3. once in 0x_subdir_name/app, `run http-server ./ --cors="\*"`

The above step 3 will setup a server allowing CORS, with the root located at 0x_subdir_name/app/ (so app/data/ages.csv is available in mastering_d3/02_getting_started, for example)

## repo structure
### 02/
Folder 02 houses a bar chart which visualizes the heights of the world's tallest buildings. Libraries used include D3 and React.
