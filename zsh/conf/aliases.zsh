function sha() {
  echo -n $@ | openssl sha
}

function md5() {
  echo -n $@ | openssl md5
}

alias yj="ruby -rjson -ryaml -e \"puts YAML.load(STDIN.read).to_json\""

function weather() {
  curl -s http://wttr.in/$@ | head -7 | tail -6
}
