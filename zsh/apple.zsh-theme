function toon {
  echo -n ""
}

get_git_dirty() {
  git diff --quiet || echo '*'
}

get_kube_context() {
  # 1. Check if kubectl exists
  if (( $+commands[kubectl] )); then
    # 2. Get current context, suppress errors
    local ctx=$(kubectl config current-context 2>/dev/null)
    
    if [[ -n "$ctx" ]]; then
      # 3. CLEANUP: If it's a long AWS ARN, grab only the text after the last '/'
      #    Transforms 'arn:aws...:cluster/my-cluster' -> 'my-cluster'
      ctx=${ctx##*/}
      
      # 4. Output: Blue symbol and name
      echo "%{$fg[cyan]%}$ctx%{$reset_color%}"
    fi
  fi
}

autoload -Uz vcs_info
zstyle ':vcs_info:*' check-for-changes true
zstyle ':vcs_info:*' unstagedstr '%F{red}*'   # display this when there are unstaged changes
zstyle ':vcs_info:*' stagedstr '%F{yellow}+'  # display this when there are staged changes
zstyle ':vcs_info:*' actionformats \
    '%F{5}%F{5}[%F{2}%b%F{3}|%F{1}%a%c%u%F{5}]%f '
zstyle ':vcs_info:*' formats       \
    '%F{5}%F{5}[%F{2}%b%c%u%F{5}]%f '
zstyle ':vcs_info:(sv[nk]|bzr):*' branchformat '%b%F{1}:%F{3}%r'
zstyle ':vcs_info:*' enable git cvs svn

theme_precmd () {
    vcs_info
}

setopt prompt_subst
NEWLINE=$'\n'
# PROMPT='%{$fg[magenta]%}$(toon)%{$fg[cyan]%} %~/ %{$reset_color%}${vcs_info_msg_0_}${NEWLINE} 𝄞 %{$reset_color%}'
PROMPT='%{$fg[magenta]%}$(toon)%{$fg[cyan]%} %~/ %{$reset_color%}${vcs_info_msg_0_}%{$fg[magenta]☸️ [%}$(get_kube_context)%{$fg[magenta]]%}${NEWLINE} 𝄞 %{$reset_color%}'

autoload -U add-zsh-hook
add-zsh-hook precmd theme_precmd