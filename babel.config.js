module.exports = (api) => {
  const esm = api.env('esm')
  const presetEnv = [
    '@lunde/es',
    {
      env: {
        modules: esm ? false : 'commonjs',
        targets: {
          node: '12',
        },
      },
      restSpread: false,
      objectAssign: false,
      typescript: false,
    },
  ]

  return {
    presets: [presetEnv],
    plugins: ['annotate-pure-calls'],
  }
}
