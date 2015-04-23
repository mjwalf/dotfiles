alias tmux='TERM=screen-256color-bce tmux'

if which tmux 2>&1 >/dev/null; then
  test -z "$TMUX" && (tmux attach || tmux new-session)
fi

tmux-switch() {
  if [ $1 = "list" ]; then
    tmux ls
  else
    if [ -z $1 ]; then
      tmux switch-client -l
    else
      if [ -z "$TMUX" ]; then
        tmux new-session -As $1
      else
        if ! tmux has-session -t $1 2>/dev/null; then
          TMUX= tmux new-session -ds $1
        fi
        tmux switch-client -t $1
      fi
    fi
  fi
}
